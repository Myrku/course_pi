﻿using Astro.Models;
using Astro.Models.Statuses;

namespace Astro.Services.Interfaces
{
    public interface IAuthService
    {
        AuthorizedUser Login(Login userForLogin);
        ActionResultStatus Register(Register registerUser);
        ActionResultStatus ResetPassword(string password, string newPassword);
        ActionResultStatus VerifyUser(string verifyCode, int userId);
    }
}
