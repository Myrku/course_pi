using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Astro.Models;
using Astro.Models.Statuses;
using Astro.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService adminService;
        public AdminController(IAdminService adminService)
        {
            this.adminService = adminService;
        }
        [HttpGet]
        [Route("get-users")]
        public List<User> GetUsers()
        {
            return adminService.GetUsers();
        }

        [HttpGet]
        [Route("add-moder/{userId}")]
        public ActionResultStatus AddModer(int userId)
        {
            return adminService.AddModerator(userId);
        }

        [HttpGet]
        [Route("delete-moder/{userId}")]
        public ActionResultStatus DeleteModer(int userId)
        {
            return adminService.DeleteModerator(userId);
        }
    }
}
