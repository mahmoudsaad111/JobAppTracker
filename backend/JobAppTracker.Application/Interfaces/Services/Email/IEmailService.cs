using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Interfaces.Services.Email
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
