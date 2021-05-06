using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class Post
    {
        public int Id { get; set; }
        public int Id_User { get; set; }
        public string Title_post { get; set; }
        public string Description_post { get; set; }
        public string Url_photo { get; set; }
        public PostTypes PostTypeId { get; set; }
        public string Tags_Json { get; set; }
    }
}
