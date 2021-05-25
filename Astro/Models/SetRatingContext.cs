using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class SetRatingContext
    {
        public int PostId { get; set; }
        public int Rating { get; set; }
    }
}
