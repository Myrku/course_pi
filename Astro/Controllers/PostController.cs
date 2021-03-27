using System.Collections.Generic;
using System.Threading.Tasks;
using Astro.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Astro.Services.Interfaces;
using Astro.Models.Statuses;

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
        public async Task<ActionResultStatus> AddPost([FromForm] string postParam, [FromForm] IFormFile uploadFile)
        {
            return await postService.AddPost(postParam, uploadFile);
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
        public PostWithParam GetPostWithParam(int id)
        {
            return postService.GetPostWithParam(id);
        }


        [Route("getpostsuser")]
        [HttpGet]
        public IEnumerable<Post> GetPostsUser()
        {
            return postService.GetPostsByUser();
        }

        [Route("deletepost/{id}")]
        [HttpDelete]
        public async Task<ActionResultStatus> DeletePost(int id)
        {
            return await postService.DeletePost(id);
        }

        [Route("editpost")]
        [HttpPut]
        public ActionResultStatus EditPostWithoutPhoto(EditPost editPost)
        {
            return postService.EditPostWithoutPhoto(editPost);
        }

        [Route("getlikes/{id}")]
        [HttpGet]
        public IActionResult GetLikes(int id)
        {
            return Ok(postService.GetLikes(id));
        }


        [Route("setlike/{id}")]
        [HttpGet]
        public ActionResultStatus SetLike(int id)
        {
            return postService.SetLike(id);
        }

        [Route("unlike/{id}")]
        [HttpGet]
        public ActionResultStatus UnLike(int id)
        {
            return postService.UnLike(id);
        }
    }
}
