using Astro.Models;
using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface ICommentService
    {
        IEnumerable<CommentInfo> GetCommentsByPostId(int postId);
        CommentInfo AddCommentToPost(CreateComment comment);
        ActionResultStatus DeleteCommentById(int commentId);
        ActionResultStatus EditComment(EditComment comment);
    }
}
