using Astro.Logging;
using Astro.Models;
using Astro.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Astro.Services
{
    public class RatingService : IRatingService
    {
        AstroDBContext dBContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        public RatingService(AstroDBContext context, IHttpContextAccessor _httpContextAccessor)
        {
            dBContext = context;
            httpContextAccessor = _httpContextAccessor;
        }
        private (int? id, string? name) GetCurrentUserInfo()
        {
            try
            {
                var id = Convert.ToInt32(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var name = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
                return (id, name);
            }
            catch
            {
                return (null, null);
            }
        }

        public PostRatingContext GetPostRating(int postId)
        {
            try
            {
                var curUser = GetCurrentUserInfo();
                Rating userRating = null;
                if (curUser.id != null)
                {
                    userRating = dBContext.Ratings.FirstOrDefault(x => x.IdUser == curUser.id && x.IdPost == postId);
                }
                var postRatings = dBContext.Ratings.Where(x => x.IdPost == postId);
                double generalRating;
                if (postRatings.Count() > 0)
                {
                    generalRating = Math.Round((double)postRatings.Sum(x => x.RatingValue) / (double)postRatings.Count(), 2, MidpointRounding.AwayFromZero);
                }
                else
                {
                    generalRating = 0;
                }
                return new PostRatingContext()
                {
                    Status = Models.Statuses.ActionResultStatus.Success,
                    CurUserRating = userRating != null ? userRating.RatingValue : 0,
                    GeneralRating = generalRating
                };
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public PostRatingContext SetPostRating(int postId, int postRating)
        {
            try
            {
                var curUser = GetCurrentUserInfo();
                var userRating = dBContext.Ratings.FirstOrDefault(x => x.IdUser == curUser.id && x.IdPost == postId);
                
                if(userRating != null)
                {
                    userRating.RatingValue = postRating;
                    dBContext.SaveChanges();
                }
                else
                {
                    var rating = new Rating()
                    {
                        IdUser = curUser.id.Value,
                        IdPost = postId,
                        RatingValue = postRating
                    };
                    dBContext.Ratings.Add(rating);
                    dBContext.SaveChanges();
                }

                var postRatings = dBContext.Ratings.Where(x => x.IdPost == postId);
                var generalRating = Math.Round((double)postRatings.Sum(x => x.RatingValue) / (double)postRatings.Count(), 2, MidpointRounding.AwayFromZero);

                return new PostRatingContext()
                {
                    Status = Models.Statuses.ActionResultStatus.Success,
                    CurUserRating = postRating,
                    GeneralRating = generalRating
                };
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }
    }
}
