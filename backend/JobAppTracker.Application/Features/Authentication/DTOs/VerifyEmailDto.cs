using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Authentication.DTOs
{
    public class VerifyEmailDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
