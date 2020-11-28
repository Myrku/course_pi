using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class AstroDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PhotoParam> PhotoParams { get; set; }
        public DbSet<Like> Likes { get; set; }

        public AstroDBContext(DbContextOptions<AstroDBContext> options) : base(options)
        {
                
        }
    }
}
