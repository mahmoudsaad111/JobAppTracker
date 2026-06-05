using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Runtime;
using System.Text;
using JobAppTracker.Application.Common.Settings;
using JobAppTracker.Application.Interfaces.Services.Email;
using Microsoft.Extensions.Options;

namespace JobAppTracker.Infrastructure.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port)
            {
                Credentials = new NetworkCredential(
                    _emailSettings.SenderEmail,
                    _emailSettings.Password
                ),
                EnableSsl = true,
            };

            var mail = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mail.To.Add(to);

            await client.SendMailAsync(mail);
        }
    }
}
