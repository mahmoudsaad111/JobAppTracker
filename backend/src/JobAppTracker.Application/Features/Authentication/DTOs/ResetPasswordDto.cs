using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Authentication.DTOs
{
    public class ResetPasswordDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
