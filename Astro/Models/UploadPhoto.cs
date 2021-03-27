using Astro.Models.Statuses;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class UploadPhoto
    {
        public string title_post { get; set; }
        public string description_post { get; set; }
        public PhotoParam photoParam { get; set; }
        public IFormFile file { get; set; }
        public PostTypes postType { get; set; }
    }
}
