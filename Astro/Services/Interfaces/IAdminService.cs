using Astro.Models;
using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface IAdminService
    {
        List<User> GetUsers();
        ActionResultStatus AddModerator(int userId);
        ActionResultStatus DeleteModerator(int userId);
    }
}
