using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class CreateComment
    {
        public int PostId { get; set; }
        public string TextComment { get; set; }
    }
}
