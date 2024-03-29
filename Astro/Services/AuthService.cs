﻿using Astro.Logging;
using Astro.Models;
using Astro.Models.Statuses;
using Astro.Services.Interfaces;
using Astro.Services.MailService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Astro.Services
{
    public class AuthService : IAuthService
    {
        AstroDBContext dBContext;
        private readonly IOptions<AuthOptions> authoptions;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IMailSender mailSender;

        public AuthService(AstroDBContext context, IOptions<AuthOptions> authoptions, IHttpContextAccessor httpContextAccessor, IMailSender mailSender)
        {
            dBContext = context;
            this.authoptions = authoptions;
            this.httpContextAccessor = httpContextAccessor;
            this.mailSender = mailSender;
        }

        private (int id, string name) GetCurrentUserInfo()
        {
            var id = Convert.ToInt32(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var name = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            return (id, name);
        }

        private User AuthUser(string username, string password)
        {
            try
            {
                return dBContext.Users.SingleOrDefault(u => u.UserName == username && u.Password == GetHashPassword(password));
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        string GenerateJWTToken(User user)
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
                expires: DateTime.Now.AddDays(authParam.TokenLifetime), signingCredentials: credentails);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GetHashPassword(string password)
        {
            using SHA512 sha512 = SHA512.Create();
            byte[] sourceBytes = Encoding.UTF8.GetBytes(password);
            byte[] hashBytes = sha512.ComputeHash(sourceBytes);
            string hash = BitConverter.ToString(hashBytes);
            return hash;
        }

        public AuthorizedUser Login(Login userForLogin)
        {
            try
            {
                var user = AuthUser(userForLogin.UserName, userForLogin.Password);
                if (user != null && user.Verificated)
                {
                    return new AuthorizedUser()
                    {
                        AccessToken = GenerateJWTToken(user),
                        Username = user.UserName,
                        Role = user.RoleId
                    };
                }
                return null;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return null;
            }
        }

        public ActionResultStatus Register(Register registerUser)
        {
            try
            {
                var user = dBContext.Add(new User()
                {
                    Email = registerUser.Email,
                    UserName = registerUser.UserName,
                    Password = GetHashPassword(registerUser.Password),
                    RoleId = Roles.User,
                    VerificationCode = GenerateVerificationCode()
                });
                dBContext.SaveChanges();
                mailSender.Send(user.Entity.Email, user.Entity.VerificationCode, user.Entity.Id);
                return ActionResultStatus.Success;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        public ActionResultStatus ResetPassword(string password, string newPassword)
        {
            try
            {
                var user = dBContext.Users.FirstOrDefault(x => x.Id == GetCurrentUserInfo().id);

                if (user != null)
                {
                    if (user.Password == GetHashPassword(password))
                    {
                        user.Password = GetHashPassword(newPassword);
                        dBContext.SaveChanges();
                        return ActionResultStatus.Success;
                    }
                }
                return ActionResultStatus.Error;
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        public ActionResultStatus VerifyUser(string verifyCode, int userId)
        {
            try
            {
                var user = dBContext.Users.FirstOrDefault(x => x.Id == userId);
                if(user != null)
                {
                    if(verifyCode == user.VerificationCode)
                    {
                        user.VerificationCode = null;
                        user.Verificated = true;
                        dBContext.SaveChanges();
                        return ActionResultStatus.Success;
                    }
                }
                return ActionResultStatus.Error;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message, ex);
                return ActionResultStatus.Error;
            }
        }

        private string GenerateVerificationCode()
        {
            var md5 = MD5.Create();
            var codeBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(DateTime.Now.ToString()));
            var code = Convert.ToBase64String(codeBytes);
            return code;
        }
    }
}
