using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Authentication.DTOs;
using MediatR;

namespace JobAppTracker.Application.Features.Authentication.Commands
{
    public class ForgotPasswordCommand : IRequest<ForgotPasswordDto>
    {
        public string Email { get; set; } = string.Empty;
    }
}
