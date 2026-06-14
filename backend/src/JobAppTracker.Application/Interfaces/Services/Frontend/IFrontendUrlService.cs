using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Interfaces.Services.Frontend
{
    public interface IFrontendUrlService
    {
        string EmailConfirmation(string userId, string token);
        string ResetPassword(string token, string email);
    }
}
