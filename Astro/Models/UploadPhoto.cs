using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class UploadPhoto
    {
        public IFormFile file { get; set; }
        public string ISO { get; set; }
    }
}
