using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.MailService
{
    public class MailSenderConfig
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public string SmtpName { get; set; }
        public int Port { get; set; }
    }
}
