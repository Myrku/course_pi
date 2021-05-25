using Astro.Models;
using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface IReportService
    {
        IEnumerable<Post> GetReports(bool isActive, ReportTypes? reportType);
        ActionResultStatus DeleteReport(int postId);
        ActionResultStatus AddReport(int postId, ReportTypes reportType);
        bool IsReported(int postId);
    }
}
