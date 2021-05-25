using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Astro.Models;
using Astro.Models.Statuses;
using Astro.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService commentService;
        public CommentController(ICommentService commentService)
        {
            this.commentService = commentService;
        }

        [HttpGet]
        [Route(@"get-comments/{postId}")]
        public IEnumerable<CommentInfo> GetComments(int postId)
        {
            return commentService.GetCommentsByPostId(postId);
        }

        [HttpPost]
        [Route("add-comment")]
        [Authorize]
        public CommentInfo AddComment(CreateComment comment)
        {
            return commentService.AddCommentToPost(comment);
        }

        [HttpPut]
        [Route(@"edit-comment")]
        [Authorize]
        public ActionResultStatus EditComment(EditComment editComment)
        {
            return commentService.EditComment(editComment);
        }

        [HttpDelete]
        [Route(@"delete-comment/{commentId}")]
        [Authorize]
        public ActionResultStatus DeleteComment(int commentId)
        {
            return commentService.DeleteCommentById(commentId);
        }
    }
}
