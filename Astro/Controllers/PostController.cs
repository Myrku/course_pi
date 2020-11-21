using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Astro.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Drawing.Imaging;
using System.Drawing;
using System.Text;
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

                        if (await blobContainer.ExistsAsync())
                        {
                            CloudBlob file = blobContainer.GetBlobReference(namefile);
                            if (await file.ExistsAsync())
                            {
                                await file.DeleteAsync();
                            }
                        }
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
    }
}
