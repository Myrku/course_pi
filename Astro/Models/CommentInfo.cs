using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class CommentInfo
    {
        public string Username { get; set; }
        public int PostId { get; set; }
        public int CommentId { get; set; }
        public string TextComment { get; set; }
        public string Date { get; set; }
        public bool IsMyComment { get; set; }
    }
}
