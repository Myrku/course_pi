using Astro.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface IAuthService
    {
        AuthorizedUser Login(Login userForLogin);
        User Register(Register registerUser);

    }
}
