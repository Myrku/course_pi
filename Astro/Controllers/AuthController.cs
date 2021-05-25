using Astro.Models;
using Astro.Models.Statuses;
using Astro.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [Route("login")]
        [HttpPost]
        public IActionResult Login ([FromForm] Login user)
        {
            var loginInfo = authService.Login(user);
            if(loginInfo != null)
            {
                return Ok(loginInfo);
            }

            return Unauthorized();
        }

        [Route("register")]
        [HttpPost]
        public ActionResultStatus Register([FromForm] Register user)
        {
            return authService.Register(user);
        }

        [HttpPost("reset-password")]
        public ActionResultStatus ResetPassword(string password, string newPassword)
        {
            return authService.ResetPassword(password, newPassword);
        }

        [HttpGet("verification")]
        public ActionResultStatus VerificationUser(string verifyCode, int userId)
        {
            return authService.VerifyUser(verifyCode, userId);
        }
    }
}
