using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int IdUser { get; set; }
        public int IdPost { get; set; }
        public int RatingValue { get; set; }
    }
}
