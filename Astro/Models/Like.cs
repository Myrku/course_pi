using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class Like
    {
        public int Id { get; set; }
        public int Id_User { get; set; }
        public int Id_Post { get; set; }
    }
}
