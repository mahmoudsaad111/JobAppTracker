using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Authentication.DTOs
{
    public class ForgotPasswordDto
    {
        /// Always true — we never reveal whether an email exists.
        public bool Success { get; set; } = true;
        public string Message { get; set; } =
            "If that email is registered, a reset link has been sent.";
    }
}
