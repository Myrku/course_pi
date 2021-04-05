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
        IEnumerable<Post> GetReports();
        ActionResultStatus DeleteReport(int postId);
        ActionResultStatus AddReport(int postId);
        bool IsReported(int postId);
    }
}
