using Astro.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface IPostService
    {
        Task<bool> AddPost(string paramPost, IFormFile file);
        IEnumerable<Post> GetPosts(PostTypes type);
        IEnumerable<Post> GetNextPost(int id);
        PostWithParam GetPostWithParam(int id);
        IEnumerable<Post> GetPostsByUser();
        Task<bool> DeletePost(int id);
        bool EditPostWithoutPhoto(EditPost editPost);
        GetLikesResult GetLikes(int id);
        bool SetLike(int id);
        bool UnLike(int id);
    }
}
