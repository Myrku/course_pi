using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class UserPageContext
    {
        public int PublishedPosts { get; set; }
        public int AllLikes { get; set; }
        public int AllReports { get; set; }
        public CameraInfo CameraInfo { get; set; }
        public List<ChartInfo> ChartInfo { get; set; }
    }
}
