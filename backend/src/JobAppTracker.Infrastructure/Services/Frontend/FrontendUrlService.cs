using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Interfaces.Services.Frontend;
using Microsoft.Extensions.Configuration;

namespace JobAppTracker.Infrastructure.Services.Frontend
{
    public class FrontendUrlService : IFrontendUrlService
    {
        private readonly string FrontendBaseUrl;

        public FrontendUrlService(IConfiguration configuration)
        {
            FrontendBaseUrl = configuration["Frontend:BaseUrl"];
        }

        public string EmailConfirmation(string userId, string token) =>
            $"{FrontendBaseUrl}/auth/verifyEmail?userId={Uri.EscapeDataString(userId)}&token={token}";

        public string ResetPassword(string token, string email) =>
            $"{FrontendBaseUrl}/auth/resetPassword?token={token}&email={email}";
    }
}
