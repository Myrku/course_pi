using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Astro.Services.MailService
{
    public class MailSender : IMailSender
    {
        private MailSenderConfig mailConfug;
        private readonly IHttpContextAccessor httpContextAccessor;
        private const string DisplayMailName = "Astro";
        private const string SubjectMail = "Verification account";
        private const string UrlTemplate = @"https://{0}/verify?code={1}&userId={2}";

        public MailSender(IOptions<MailSenderConfig> _mailConfug, IHttpContextAccessor _httpContextAccessor)
        {
            mailConfug = _mailConfug.Value;
            httpContextAccessor = _httpContextAccessor;
        }
        public async Task Send(string userMail, string verifyCode, int userId)
        {
            if (string.IsNullOrWhiteSpace(userMail)) throw new ArgumentException(userMail);

            try
            {
                var verifyUrl = String.Format(UrlTemplate, httpContextAccessor.HttpContext.Request.Host.Value, verifyCode, userId);
                var from = new MailAddress(mailConfug.Login, DisplayMailName);
                var to = new MailAddress(userMail);
                var mail = new MailMessage(from, to)
                {
                    Subject = SubjectMail,
                    Body = " If you received an account verification email in error, it's likely that another user accidentally entered your email while trying to recover " +
                    "their own email account. If you didn't initiate the request, you don't need to take any further action. You can simply disregard the verification email, " +
                    $"and the account won't be verified. <br> <a href=\"{verifyUrl}\">Click here for verification your account</a>",
                    IsBodyHtml = true
                };
                using (SmtpClient smtp = new SmtpClient(mailConfug.SmtpName, mailConfug.Port))
                {
                    smtp.Credentials = new NetworkCredential(mailConfug.Login, mailConfug.Password);
                    smtp.EnableSsl = true;
                    await smtp.SendMailAsync(mail);
                    smtp.Dispose();
                }
                mail.Dispose();
            }
            catch (Exception ex)
            {
                Logging.Logger.LogError(ex.Message, ex);
            }
        }
    }
}
