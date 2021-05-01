using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class CameraInfo
    {
        [Key]
        public int IdUser { get; set; }
        public string Camera { get; set; }
        public string CameraLens { get; set; }
    }
}
