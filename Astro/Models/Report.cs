using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class Report
    {
        public int ReportId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public ReportTypes ReportType { get; set; }
        public bool IsActive { get; set; }
    }
}
