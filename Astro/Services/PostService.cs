using Astro.Logging;
using Astro.Models;
using Astro.Models.Statuses;
using Astro.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Astro.Services
{
    public class PostService : IPostService
    {
        private readonly IOptions<BlobConfig> config;
        private readonly AstroDBContext dBContext;
        const int COUNT_GET_POSTS = 6;
        private readonly IHttpContextAccessor httpContextAccessor;
        public PostService(IOptions<BlobConfig> config, AstroDBContext dBContext, IHttpContextAccessor httpContextAccessor)
        {
            this.config = config;
            this.dBContext = dBContext;
            this.httpContextAccessor = httpContextAccessor;
        }
        private (int id, string name) GetCurrentUserInfo()
        {
            var id = Convert.ToInt32(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var name = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            return (id, name);
        }
        public async Task<ActionResultStatus> AddPost(string paramPost, IFormFile file)
        {
            if (CloudStorageAccount.TryParse(config.Value.StorageConnection, out CloudStorageAccount storageAccount))
            {
                var upload = JsonConvert.DeserializeObject<UploadPhoto>(paramPost);
                upload.file = file;
                var curUser = GetCurrentUserInfo();
                var time = DateTime.Now.ToString("dd.MM.yyyy_HH:mm:ss");
                string namefile = $"{curUser.name}_{time}";
                try
                {
                    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                    CloudBlobContainer blobContainer = blobClient.GetContainerReference(config.Value.Container);
                    CloudBlockBlob blockBlob = blobContainer.GetBlockBlobReference(namefile);
                    await blockBlob.UploadFromStreamAsync(upload.file.OpenReadStream());
                    string upload_url = blockBlob.Uri.AbsoluteUri;
                    using var transaction = dBContext.Database.BeginTransaction();
                    try
                    {
                        Post post = new Post()
                        {
                            Id_User = curUser.id,
                            Title_post = upload.title_post,
                            Description_post = upload.description_post,
                            Url_photo = upload_url,
                            PostTypeId = upload.postType
                        };
                        dBContext.Posts.Add(post);
                        dBContext.SaveChanges();
                        upload.photoParam.Id_post = post.Id;
                        dBContext.PhotoParams.Add(upload.photoParam);
                        dBContext.SaveChanges();
                        transaction.Commit();
                    }
                    catch(Exception ex)
                    {
                        await blockBlob.DeleteAsync();
                        transaction.Rollback();
                        Logger.LogError(ex.Message, ex);
                        return ActionResultStatus.Error;
                    }
                }
                catch(Exception ex)
                {
                    Logger.LogError(ex.Message, ex);
                    return ActionResultStatus.Error;
                }
                return ActionResultStatus.Success;
            }
            return ActionResultStatus.Error;
        }

        public async Task<ActionResultStatus> DeletePost(int id)
        {
            using var transaction = dBContext.Database.BeginTransaction();
            Post post = dBContext.Posts.Find(id);
            try
            {
                if (CloudStorageAccount.TryParse(config.Value.StorageConnection, out CloudStorageAccount storageAccount))
                {
                    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                    CloudBlobContainer blobContainer = blobClient.GetContainerReference(config.Value.Container);
                    string blobName = new CloudBlockBlob(new Uri(post.Url_photo)).Name;
                    var targetBlob = blobContainer.GetBlockBlobReference(blobName);
                    await targetBlob.DeleteIfExistsAsync();
                    var likes = dBContext.Likes.Where(x => x.Id_Post == post.Id);
                    dBContext.Likes.RemoveRange(likes);
                    dBContext.Posts.Remove(post);
                    dBContext.SaveChanges();
                    transaction.Commit();
                }
                return ActionResultStatus.Success;
            }
            catch(Exception ex)
            {
                transaction.Rollback();
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        public ActionResultStatus EditPostWithoutPhoto(EditPost editPost)
        {
            using var transaction = dBContext.Database.BeginTransaction();

            try
            {
                dBContext.Posts.Update(editPost.post);
                dBContext.SaveChanges();
                dBContext.PhotoParams.Update(editPost.photoParam);
                dBContext.SaveChanges();
                transaction.Commit();
                return ActionResultStatus.Success;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        public GetLikesResult GetLikes(int id)
        {
            try
            {
                var curUser = GetCurrentUserInfo();
                var likes = dBContext.Likes.Where(x => x.Id_Post == id).ToList();
                bool isLike = likes.Find(x => x.Id_User == curUser.id) != null;
                return new GetLikesResult()
                {
                    IsLike = isLike,
                    CountLike = likes.Count
                };
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public IEnumerable<Post> GetNextPost(int id)
        {
            try
            {
                return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.Id < id).Take(COUNT_GET_POSTS);
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public IEnumerable<Post> GetPosts(PostTypes type)
        {
            try
            {
                if (type == PostTypes.NoType)
                {
                    return dBContext.Posts.OrderByDescending(x => x.Id).Take(COUNT_GET_POSTS);
                }
                return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.PostTypeId == type).Take(COUNT_GET_POSTS);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public IEnumerable<Post> GetPostsByCurUser()
        {
            try
            {
                var curUser = GetCurrentUserInfo();
                return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.Id_User == curUser.id);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public IEnumerable<Post> GetPostsByUserId(int userId)
        {
            try
            {
                return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.Id_User == userId);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public PostWithParam GetPostWithParam(int id)
        {
            try
            {
                var post = dBContext.Posts.Find(id);
                var param = dBContext.PhotoParams.First(x => x.Id_post == id);
                var userName = dBContext.Users.FirstOrDefault(x => x.Id == post.Id_User).UserName;
                var postWithParam = new PostWithParam()
                {
                    PhotoParam = param,
                    Post = post,
                    UserName = userName
                };
                return postWithParam;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public ActionResultStatus SetLike(int id)
        {
            try
            {
                var curUser = GetCurrentUserInfo();
                dBContext.Likes.Add(new Like()
                {
                    Id_Post = id,
                    Id_User = curUser.id
                });
                dBContext.SaveChanges();
                return ActionResultStatus.Success;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        public ActionResultStatus UnLike(int id)
        {
            try
            {
                var curUser = GetCurrentUserInfo();
                var like = dBContext.Likes.First(x => x.Id_Post == id && x.Id_User == curUser.id);
                if (like != null)
                {
                    dBContext.Likes.Remove(like);
                    dBContext.SaveChanges();
                    return ActionResultStatus.Success;
                }
                return ActionResultStatus.Error;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }
    }
}
