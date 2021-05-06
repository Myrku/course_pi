using Astro.Models.Statuses;
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
        public string Camera { get; set; }
        public string Camera_lens { get; set; }
        public string ISO { get; set; }
        public string Exposition { get; set; }
        public string Aperture { get; set; }
        public string Processing_photo { get; set; }
        public double? Lat_Location { get; set; }
        public double? Lng_Location { get; set; }
    }
}
