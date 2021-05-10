using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.MailService
{
    public interface IMailSender
    {
        Task Send(string userMail, string verifyCode, int userId);
    }
}
