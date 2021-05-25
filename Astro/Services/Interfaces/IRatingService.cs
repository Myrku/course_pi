using Astro.Models;
using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface IRatingService
    {
        PostRatingContext GetPostRating(int postId);
        PostRatingContext SetPostRating(int postId, int postRating);
    }
}
