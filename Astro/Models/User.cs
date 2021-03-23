using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        internal static string FindFirst(string name)
        {
            throw new NotImplementedException();
        }
    }
}
