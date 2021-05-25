using Astro.Models;
using Astro.Models.Statuses;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface IPostService
    {
        Task<ActionResultStatus> AddPost(string paramPost, IFormFile file);
        IEnumerable<Post> GetPosts(PostTypes type);
        IEnumerable<Post> GetLikesPostByCurUser();
        IEnumerable<Post> GetNextPost(int id);
        PostWithParam GetPostWithParam(int id);
        IEnumerable<Post> GetPostsByCurUser();
        IEnumerable<Post> GetPostsByUserId(int userId);
        Task<ActionResultStatus> DeletePost(int id);
        ActionResultStatus EditPostWithoutPhoto(EditPost editPost);
        GetLikesResult GetLikes(int id);
        ActionResultStatus SetLike(int id);
        ActionResultStatus UnLike(int id);
    }
}
