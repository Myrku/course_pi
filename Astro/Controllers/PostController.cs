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
using Astro.Services.Interfaces;

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        IPostService postService;
        public PostController(IPostService postService)
        {
            this.postService = postService;
        }

        [Route("addpost")]
        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> AddPost([FromForm] string postParam, [FromForm] IFormFile uploadFile)
        {
            var result = await postService.AddPost(postParam, uploadFile);
            if(result)
            {
                return Ok(new 
                {
                    status = "Success",
                });
            }
            return Ok(new
            {
                status = "Error",
            });
        }

        [Route("getposts/{type}")]
        [HttpGet]
        public IEnumerable<Post> GetPosts(PostTypes type)
        {
            return postService.GetPosts(type);
        }

        [Route("getnextpost/{id}")]
        [HttpGet]
        public IEnumerable<Post> GetNextPost(int id)
        {
            return postService.GetNextPost(id);
        }

        [Route("getpost/{id}")]
        [HttpGet]
        public IActionResult GetPostWithParam(int id)
        {
            var result = postService.GetPostWithParam(id);
            return Ok(new
            {
                result
            });
        }


        [Route("getpostsuser")]
        [HttpGet]
        public IEnumerable<Post> GetPostsUser()
        {
            return postService.GetPostsByUser();
        }

        [Route("deletepost/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeletePost(int id)
        {
            var result = await postService.DeletePost(id);
            if(result)
            {
                return Ok(new
                {
                    status = "Success"
                });
            }
            return Ok(new
            {
                status = "Error"
            });
        }

        [Route("editpost")]
        [HttpPut]
        public IActionResult EditPostWithoutPhoto(EditPost editPost)
        {
            var result = postService.EditPostWithoutPhoto(editPost);
            if (result)
            {
                return Ok(new
                {
                    status = "Success"
                });
            }
            return Ok(new
            {
                status = "Error"
            });
        }

        [Route("getlikes/{id}")]
        [HttpGet]
        public IActionResult GetLikes(int id)
        {
            return Ok(postService.GetLikes(id));
        }


        [Route("setlike/{id}")]
        [HttpGet]
        public IActionResult SetLike(int id)
        {
            var result = postService.SetLike(id);
            if (result)
            {
                return Ok(new
                {
                    status = "Success"
                });
            }
            return Ok(new
            {
                status = "Error"
            });
        }

        [Route("unlike/{id}")]
        [HttpGet]
        public IActionResult UnLike(int id)
        {
            var result = postService.UnLike(id);
            if (result)
            {
                return Ok(new
                {
                    status = "Success"
                });
            }
            return Ok(new
            {
                status = "Error"
            });
        }
    }
}
