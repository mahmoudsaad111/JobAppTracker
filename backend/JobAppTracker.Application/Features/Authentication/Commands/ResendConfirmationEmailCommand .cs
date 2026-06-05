using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace JobAppTracker.Application.Features.Authentication.Commands
{
    public class ResendConfirmationEmailCommand : IRequest<bool>
    {
        public string Email { get; set; }
    }
}
