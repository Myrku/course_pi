using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class PhotoParam
    {
        public int Id { get; set; }
        public int Id_post { get; set; }
        public string camera { get; set; }
        public string camera_lens { get; set; }
        public string ISO { get; set; }
        public string exposition { get; set; }
        public string aperture { get; set; }
        public string processing_photo { get; set; }
    }
}
