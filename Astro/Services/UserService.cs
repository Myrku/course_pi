using Astro.Logging;
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
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly AstroDBContext dBContext;

        public UserService(IHttpContextAccessor httpContextAccessor, AstroDBContext dBContext)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.dBContext = dBContext;
        }

        private (int id, string name) GetCurrentUserInfo()
        {
            var id = Convert.ToInt32(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var name = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            return (id, name);
        }

        public UserPageContext GetContext()
        {
            try
            {
                var userId = GetCurrentUserInfo().id;

                var postCount = dBContext.Posts.Where(x => x.Id_User == userId).Count();
                var reportsCount = dBContext.Reports.Where(x => x.UserId == userId).Count();
                var cameraInfo = dBContext.CameraInfos.FirstOrDefault(x => x.IdUser == userId);

                var chartInfo = new List<ChartInfo>();
                var userPosts = dBContext.Posts.Where(x => x.Id_User == userId).ToList();
                int likesCount = 0;

                for (int i = 0; i < userPosts.Count; i++)
                {
                    var postLikes = dBContext.Likes.Where(x => x.Id_Post == userPosts[i].Id).Count();
                    likesCount += postLikes;
                    chartInfo.Add(new ChartInfo()
                    {
                        Name = userPosts[i].Title_post,
                        Value = postLikes
                    });
                }

                var result = new UserPageContext()
                {
                    PublishedPosts = postCount,
                    AllLikes = likesCount,
                    AllReports = reportsCount,
                    CameraInfo = cameraInfo ?? new CameraInfo(),
                    ChartInfo = chartInfo.OrderBy(x => x.Value).Take(10).ToList()
                };

                return result;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                throw new Exception("Failed to get user info");
            }
        }

        public ActionResultStatus SetCamera(CameraInfo camera)
        {
            try
            {
                camera.IdUser = GetCurrentUserInfo().id;
                var cameraInfo = dBContext.CameraInfos.FirstOrDefault(x => x.IdUser == camera.IdUser);
                if (cameraInfo == null)
                {
                    dBContext.CameraInfos.Add(camera);
                    dBContext.SaveChanges();
                    return ActionResultStatus.Success;
                }
                else
                {
                    cameraInfo.Camera = camera.Camera;
                    cameraInfo.CameraLens = camera.CameraLens;
                    dBContext.SaveChanges();
                    return ActionResultStatus.Success;
                }
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        public string GetUserNameById(int userId)
        {
            try
            {
                var userName = dBContext.Users.FirstOrDefault(x => x.Id == userId).UserName;
                return userName;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public CameraInfo GetUserCamera()
        {
            try
            {
                var userId = GetCurrentUserInfo().id;
                var cameraInfo = dBContext.CameraInfos.FirstOrDefault(x => x.IdUser == userId);
                return cameraInfo;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }
    }
}
