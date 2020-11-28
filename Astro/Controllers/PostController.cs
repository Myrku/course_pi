using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Astro.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System.Security.Claims;

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IOptions<BlobConfig> config;
        AstroDBContext dBContext;
        const int COUNT_GET_POSTS = 6;
        public PostController(IOptions<BlobConfig> config, AstroDBContext dBContext)
        {
            this.config = config;
            this.dBContext = dBContext;
        }

        [Route("addpost")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> AddPost([FromForm] string param_post, [FromForm] IFormFile upload_file)
        {
            var upload = JsonConvert.DeserializeObject<UploadPhoto>(param_post);
            upload.file = upload_file;
            int id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            string name = User.FindFirst(ClaimTypes.Name)?.Value;
            //User user = dBContext.Users.Find(id);
            var time = DateTime.Now;
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
                    catch (Exception ex)
                    {

                        await blockBlob.DeleteAsync();
                        transaction.Rollback();
                        return Ok(new
                        {
                            status = "Error"
                        });
                    }

                }
                else
                {
                    return Ok(new
                    {
                        status = "Error"
                    });
                }

                return Ok(new
                {
                    status = "Success"
                });
            }
            catch
            {
                return Ok(new
                {
                    status = "Error"
                });
            }
        }

        [Route("getposts")]
        [HttpGet]
        public IEnumerable<Post> GetPosts()
        {
            return dBContext.Posts.OrderByDescending(x => x.Id).Take(COUNT_GET_POSTS);
        }

        [Route("getnextpost/{id}")]
        [HttpGet]
        public IEnumerable<Post> GetNextPost(int id)
        {
            return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.Id < id).Take(COUNT_GET_POSTS);
        }

        [Route("getpost/{id}")]
        [HttpGet]
        public IActionResult GetPostWithParam(int id)
        {
            var post = dBContext.Posts.Find(id);
            var param = dBContext.PhotoParams.First(x => x.Id_post == id);
            return Ok(new
            {
                post,
                param
            });
        }


        [Route("getpostsuser")]
        [HttpGet]
        public IEnumerable<Post> GetPostsUser()
        {
            int id = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return dBContext.Posts.OrderByDescending(x => x.Id).Where(x => x.Id_User == id);
        }

        [Route("deletepost/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeletePost(int id)
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
                    return Ok(new
                    {
                        status = "Success",
                    });
                }
                return Ok(new
                {
                    status = "Success"
                });
            }
            catch
            {
                return Ok(new
                {
                    status = "Error"
                });
            }
        }

        [Route("editpost")]
        [HttpPut]
        public IActionResult EditPostWithoutPhoto(EditPost editPost)
        {
            using var transaction = dBContext.Database.BeginTransaction();

            try
            {
                dBContext.Posts.Update(editPost.post);
                dBContext.SaveChanges();
                dBContext.PhotoParams.Update(editPost.photoParam);
                dBContext.SaveChanges();
                transaction.Commit();
                return Ok(new
                {
                    status = "Success"
                });
            }
            catch (Exception)
            {
                transaction.Rollback();
                return Ok(new
                {
                    status = "Error"
                });
            }
        }

        [Route("getlikes/{id}")]
        [HttpGet]
        public IActionResult GetLikes(int id)
        {
            int id_user = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var likes = dBContext.Likes.Where(x => x.Id_Post == id).ToList();
            bool isLike = likes.Find(x => x.Id_User == id_user) != null ? true : false;
            return Ok(new
            {
                isLike = isLike,
                countLikes = likes.Count
            });
        }


        [Route("setlike/{id}")]
        [HttpGet]
        public IActionResult SetLike(int id)
        {
            try
            {
                int id_user = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                dBContext.Likes.Add(new Like()
                {
                    Id_Post = id,
                    Id_User = id_user
                });
                dBContext.SaveChanges();
                return Ok(new
                {
                    status = "Success"
                });
            }
            catch
            {
                return Ok(new
                {
                    status = "Error"
                });
            }
        }

        [Route("unlike/{id}")]
        [HttpGet]
        public IActionResult UnLike(int id)
        {
            try
            {
                int id_user = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var like = dBContext.Likes.First(x => x.Id_Post == id && x.Id_User == id_user);
                if(like != null)
                {
                    dBContext.Likes.Remove(like);
                    dBContext.SaveChanges();
                    return Ok(new
                    {
                        status = "Success"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = "Error"
                    });
                }
            }
            catch
            {
                return Ok(new
                {
                    status = "Error"
                });
            }
        }
    }
}
