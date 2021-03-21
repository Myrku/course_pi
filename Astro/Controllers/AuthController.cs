using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Astro.Models;
using Astro.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        IAuthService authService;
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
        public IActionResult Register([FromForm] Register user)
        {
            var registerUser = authService.Register(user);
            if(registerUser != null)
            {
                return Ok(new
                {
                    status = "Success"
                });
            }
            return Ok(new
            {
                status = "Error"
            });
        }
    }
}
