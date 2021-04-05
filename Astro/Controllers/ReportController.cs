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
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportService reportService;
        public ReportController(IReportService reportService)
        {
            this.reportService = reportService;
        }

        [HttpGet]
        [Route(@"get-reports")]
        public IEnumerable<Post> GetReports()
        {
            return reportService.GetReports();
        }

        [HttpPost]
        [Route(@"add-report")]
        public ActionResultStatus AddReport([FromBody]int postId)
        {
            return reportService.AddReport(postId);
        }

        [HttpDelete]
        [Route(@"delete-report/{postId}")]
        public ActionResultStatus DeleteReport(int postId)
        {
            return reportService.DeleteReport(postId);
        }
    }
}
