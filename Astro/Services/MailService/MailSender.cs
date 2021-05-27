using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System;

namespace Astro.Services.MailService
{
    public class MailSender : IMailSender
    {
        private MailSenderConfig mailConfug;
        private const string DisplayMailName = "Astro";
        private const string SubjectMail = "Verification account";
        private const string UrlTemplate = @"https://astro1.azurewebsites.net/verify?code={0}&userId={1}";

        public MailSender(IOptions<MailSenderConfig> _mailConfug)
        {
            mailConfug = _mailConfug.Value;
        }
        public void Send(string userMail, string verifyCode, int userId)
        {
            if (string.IsNullOrWhiteSpace(userMail)) throw new ArgumentException(userMail);

            try
            {
                var verifyUrl = String.Format(UrlTemplate, verifyCode, userId);
                MimeMessage message = new MimeMessage();
                message.From.Add(new MailboxAddress(DisplayMailName, (mailConfug.Login)));
                message.To.Add(new MailboxAddress(userMail));
                message.Subject = SubjectMail;

                message.Body = new BodyBuilder() 
                { 
                    HtmlBody = "If you received an account verification email in error, it's likely that another user accidentally entered your email while trying to recover " +
                    "their own email account. If you didn't initiate the request, you don't need to take any further action. You can simply disregard the verification email, " +
                    $"and the account won't be verified. <br> <a href=\"{verifyUrl}\">Click here for verification your account</a>"
                }.ToMessageBody();

                using (SmtpClient client = new SmtpClient())
                {
                    client.Connect(mailConfug.SmtpName, mailConfug.Port, SecureSocketOptions.StartTls);
                    client.Authenticate(mailConfug.Login, mailConfug.Password);
                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                Logging.Logger.LogError(ex.Message, ex);
            }
        }
    }
}
