using Astro.Logging;
using Astro.Models;
using Astro.Models.Statuses;
using Astro.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services
{
    public class AdminService : IAdminService
    {
        AstroDBContext dBContext;
        public AdminService(AstroDBContext context)
        {
            dBContext = context;
        }
        public ActionResultStatus DeleteModerator(int userId)
        {
            try
            {
                var user = dBContext.Users.Find(userId);
                user.RoleId = Roles.User;
                dBContext.SaveChanges();
                return ActionResultStatus.Success;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        public List<User> GetUsers()
        {
            try
            {
                return dBContext.Users.Where(x => x.RoleId != Roles.Admin).ToList();
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                throw new Exception("Failed get users");
            }
        }

        public ActionResultStatus AddModerator(int userId)
        {
            try
            {
                var user = dBContext.Users.Find(userId);
                user.RoleId = Roles.Moderator;
                dBContext.SaveChanges();
                return ActionResultStatus.Success;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }
    }
}
