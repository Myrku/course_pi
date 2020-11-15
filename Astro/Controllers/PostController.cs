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

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IOptions<BlobConfig> config;
        public PostController(IOptions<BlobConfig> config)
        {
            this.config = config;
        }

        [Route("addpost")]
        [HttpPost]
        public async Task<IActionResult> AddPost(IFormFile asset)
        {
            try
            {
                if (CloudStorageAccount.TryParse(config.Value.StorageConnection, out CloudStorageAccount storageAccount))
                {
                    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                    CloudBlobContainer blobContainer = blobClient.GetContainerReference(config.Value.Container);
                    CloudBlockBlob blockBlob = blobContainer.GetBlockBlobReference(asset.FileName);
                    await blockBlob.UploadFromStreamAsync(asset.OpenReadStream());
                    return Ok(new
                    {
                        fileUrl = blockBlob.Uri.AbsoluteUri
                    });
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch
            {
                return Unauthorized();
            }
        }
    }
}
