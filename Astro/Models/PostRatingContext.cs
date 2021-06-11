using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class PostRatingContext
    {
        public int CurUserRating { get; set; }
        public double GeneralRating { get; set; }
        public ActionResultStatus Status { get; set; }
    }
}
