using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Astro.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Astro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        AstroDBContext dBContext;
        private readonly IOptions<AuthOptions> authoptions;
        public AuthController(AstroDBContext context, IOptions<AuthOptions> authoptions)
        {
            dBContext = context;
            this.authoptions = authoptions;
        }
        [Route("login")]
        [HttpPost]
        public IActionResult Login ([FromForm] Login user_req)
        {
            var user = AuthUser(user_req.UserName, user_req.Password);
            if (user != null)
            {
                var token = GenerateJWTToken(user);
                return Ok(new
                {
                    access_token = token
                });
            }

            return Unauthorized();
        }

        [Route("register")]
        [HttpPost]
        public IActionResult Register([FromForm] Register register_user)
        {
            try
            {
                dBContext.Add(new User()
                {
                    Email = register_user.Email,
                    UserName = register_user.UserName,
                    Password = GetHashPassword(register_user.Password)
                });
                dBContext.SaveChanges();
                return Ok(new {
                   status = "Success"
                });
            }
            catch(Exception ex)
            {
                return Ok(new
                {
                    status = ex.Message
                });
            }
        }

        private User AuthUser(string username, string password)
        {
            return dBContext.Users.SingleOrDefault(u => u.UserName == username && u.Password == GetHashPassword(password));
        }
        private string GenerateJWTToken(User user)
        {
            var authParam = authoptions.Value;
            var securityKey = authParam.GetSymmetricSecurityKey();
            var credentails = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            };
            var token = new JwtSecurityToken(authParam.Issuer, authParam.Audience, claims,
                expires: DateTime.Now.AddSeconds(authParam.TokenLifetime), signingCredentials: credentails);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string GetHashPassword(string password)
        {
            using(SHA512 sha512 = SHA512.Create())
            {
                byte[] sourceBytes = Encoding.UTF8.GetBytes(password);
                byte[] hashBytes = sha512.ComputeHash(sourceBytes);
                string hash = BitConverter.ToString(hashBytes);
                return hash;
            }
        }
    }
}
