using Astro.Models;
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
        AstroDBContext dBContext;
        const int COUNT_GET_POSTS = 6;
        public PostService(IOptions<BlobConfig> config, AstroDBContext dBContext)
        {
            this.config = config;
            this.dBContext = dBContext;
        }
        public async Task<bool> AddPost(string paramPost, IFormFile file)
        {
            var upload = JsonConvert.DeserializeObject<UploadPhoto>(paramPost);
            upload.file = file;
            var id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier));
            var name = User.FindFirst(ClaimTypes.Name);
            var time = DateTime.Now.ToString("dd.MM.yyyy_HH:mm:ss");
            string namefile = $"{name}_{time}";
            try
            {
                if (CloudStorageAccount.TryParse(config.Value.StorageConnection, out CloudStorageAccount storageAccount))
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
                            Id_User = id,
                            Title_post = upload.title_post,
                            Description_post = upload.description_post,
                            Url_photo = upload_url
                        };
                        dBContext.Posts.Add(post);
                        dBContext.SaveChanges();
                        upload.photoParam.Id_post = post.Id;
                        dBContext.PhotoParams.Add(upload.photoParam);
                        dBContext.SaveChanges();
                        transaction.Commit();
                    }
                    catch
                    {

                        await blockBlob.DeleteAsync();
                        transaction.Rollback();
                        return false;
                    }

                }
                else
                {
                    return false;
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeletePost(int id)
        {
            try
            {
                Post post = dBContext.Posts.Find(id);
                dBContext.Posts.Remove(post);
                if (CloudStorageAccount.TryParse(config.Value.StorageConnection, out CloudStorageAccount storageAccount))
                {
                    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                    CloudBlobContainer blobContainer = blobClient.GetContainerReference(config.Value.Container);
                    string blobName = new CloudBlockBlob(new Uri(post.Url_photo)).Name;
                    var targetBlob = blobContainer.GetBlockBlobReference(blobName);
                    await targetBlob.DeleteAsync();

                    dBContext.SaveChanges();
                    
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool EditPostWithoutPhoto(EditPost editPost)
        {
            using var transaction = dBContext.Database.BeginTransaction();

            try
            {
                dBContext.Posts.Update(editPost.post);
                dBContext.SaveChanges();
                dBContext.PhotoParams.Update(editPost.photoParam);
                dBContext.SaveChanges();
                transaction.Commit();
                return true;
            }
            catch (Exception)
            {
                transaction.Rollback();
                return false;
            }
        }

        public GetLikesResult GetLikes(int id)
        {
            int id_user = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier));
            var likes = dBContext.Likes.Where(x => x.Id_Post == id).ToList();
            bool isLike = likes.Find(x => x.Id_User == id_user) != null ? true : false;
            return new GetLikesResult()
            {
                IsLike = isLike,
                CountLike = likes.Count
            };
        }

        public IEnumerable<Post> GetNextPost(int id)
        {
            return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.Id < id).Take(COUNT_GET_POSTS);
        }

        public IEnumerable<Post> GetPosts(PostTypes type)
        {
            return dBContext.Posts.OrderByDescending(x => x.Id).Take(COUNT_GET_POSTS);
        }

        public IEnumerable<Post> GetPostsByUser()
        {
            int id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier));
            return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.Id_User == id);
        }

        public PostWithParam GetPostWithParam(int id)
        {
            var post = dBContext.Posts.Find(id);
            var param = dBContext.PhotoParams.First(x => x.Id_post == id);
            var postWithParam = new PostWithParam()
            {
                photoParam = param,
                post = post
            };
            return postWithParam;
        }

        public bool SetLike(int id)
        {
            try
            {
                int id_user = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier));
                dBContext.Likes.Add(new Like()
                {
                    Id_Post = id,
                    Id_User = id_user
                });
                dBContext.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UnLike(int id)
        {
            try
            {
                int id_user = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier));
                var like = dBContext.Likes.First(x => x.Id_Post == id && x.Id_User == id_user);
                if (like != null)
                {
                    dBContext.Likes.Remove(like);
                    dBContext.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
