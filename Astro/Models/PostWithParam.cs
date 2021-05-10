using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class PostWithParam
    {
        public Post Post { get; set; }
        public PhotoParam PhotoParam { get; set; }
        public string UserName { get; set; }
    }
}
