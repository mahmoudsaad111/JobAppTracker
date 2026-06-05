using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Authentication.DTOs;
using MediatR;

namespace JobAppTracker.Application.Features.Authentication.Commands
{
    public class VerifyEmailCommand : IRequest<VerifyEmailDto>
    {
        public Guid UserId { get; set; }
        public string Token { get; set; }
    }
}
