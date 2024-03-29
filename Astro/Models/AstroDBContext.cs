﻿using Microsoft.EntityFrameworkCore;
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
        public DbSet<Report> Reports { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CameraInfo> CameraInfos { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public AstroDBContext(DbContextOptions<AstroDBContext> options) : base(options)
        {
                
        }
    }
}
