using Astro.Models;
using Astro.Models.Statuses;
using Astro.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Astro.Services
{
    public class CommentService : ICommentService
    {
        private readonly AstroDBContext dBContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public CommentService(AstroDBContext dBContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dBContext = dBContext;
            this.httpContextAccessor = httpContextAccessor;
        }
        private (int id, string name) GetCurrentUserInfo()
        {
            var id = Convert.ToInt32(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var name = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            return (id, name);
        }
        public CommentInfo AddCommentToPost(CreateComment createComment)
        {
            try
            {
                var comment = new Comment()
                {
                    UserId = GetCurrentUserInfo().id,
                    Date = DateTime.UtcNow,
                    PostId = createComment.PostId,
                    TextComment = createComment.TextComment
                };

                dBContext.Comments.Add(comment);
                dBContext.SaveChanges();
                return Fill(comment);
            }
            catch
            {
                return null;
            }
        }

        public ActionResultStatus DeleteCommentById(int commentId)
        {
            try
            {
                var comment = new Comment()
                {
                    CommentId = commentId
                };
                dBContext.Comments.Attach(comment);
                dBContext.Comments.Remove(comment);
                dBContext.SaveChanges();
                return ActionResultStatus.Success;
            }
            catch
            {
                return ActionResultStatus.Error;
            }
            throw new NotImplementedException();
        }

        public ActionResultStatus EditComment(EditComment editComment)
        {
            try
            {
                var comment = dBContext.Comments.Find(editComment.CommentId);
                if(comment != null)
                {
                    comment.TextComment = editComment.CommentText;
                    dBContext.SaveChanges();
                    return ActionResultStatus.Success;
                }
                return ActionResultStatus.Error;
            }
            catch
            {
                return ActionResultStatus.Error;
            }
        }

        public IEnumerable<CommentInfo> GetCommentsByPostId(int postId)
        {
            var comments = dBContext.Comments.Where(x => x.PostId == postId).OrderByDescending(x => x.Date).ToList();
            var commentsInfo = new List<CommentInfo>();
            foreach (var comment in comments)
            {
                commentsInfo.Add(Fill(comment));
            }
            return commentsInfo;

            
        }
        private CommentInfo Fill(Comment comment)
        {
            return new CommentInfo()
            {
                CommentId = comment.CommentId,
                TextComment = comment.TextComment,
                PostId = comment.PostId,
                Date = comment.Date.ToString(),
                Username = dBContext.Users.Find(comment.UserId).UserName,
                IsMyComment = comment.UserId == GetCurrentUserInfo().id
            };
        }
    }
}
