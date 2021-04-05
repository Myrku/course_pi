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
    public class ReportService : IReportService
    {
        private readonly AstroDBContext dBContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ReportService(AstroDBContext dBContext, IHttpContextAccessor httpContextAccessor)
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
        public ActionResultStatus AddReport(int postId)
        {
            try
            {
                var report = new Report()
                {
                    PostId = postId,
                    UserId = GetCurrentUserInfo().id
                };
                dBContext.Reports.Add(report);
                dBContext.SaveChanges();
                return ActionResultStatus.Success;
            }
            catch
            {
                return ActionResultStatus.Error;
            }
        }

        public ActionResultStatus DeleteReport(int postId)
        {
            try
            {
                var reports = dBContext.Reports.Where(item => item.PostId == postId).ToList();
                dBContext.Reports.RemoveRange(reports);
                dBContext.SaveChanges();
                return ActionResultStatus.Success;
            }
            catch
            {
                return ActionResultStatus.Error;
            }
        }

        public IEnumerable<Post> GetReports()
        {
            try
            {
                var postsReport = dBContext.Reports.GroupBy(x => x.PostId).Where(x => x.Count() >= 5).Select(x => x.Key).ToList();
                var posts = new List<Post>();
                foreach (var postId in postsReport)
                {
                    posts.Add(dBContext.Posts.Find(postId));
                }
                return posts;
            }
            catch
            {
                return null;
            }
        }

        public bool IsReported(int postId)
        {
            try
            {
                var report = dBContext.Reports.Where(x => x.PostId == postId && x.UserId == GetCurrentUserInfo().id);
                return report != null;
            }
            catch
            {
                return false;
            }
        }
    }
}
