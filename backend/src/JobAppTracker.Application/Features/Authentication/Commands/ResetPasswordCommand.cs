using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Authentication.DTOs;
using MediatR;

namespace JobAppTracker.Application.Features.Authentication.Commands
{
    public class ResetPasswordCommand : IRequest<ResetPasswordDto>
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
    }
}
