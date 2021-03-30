using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class AuthorizedUser
    {
        public string AccessToken { get; set; }
        public string Username { get; set; }
        public Roles Role { get; set; }
    }
}
