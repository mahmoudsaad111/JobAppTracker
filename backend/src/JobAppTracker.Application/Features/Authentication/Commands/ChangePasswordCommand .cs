using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace JobAppTracker.Application.Features.Authentication.Commands
{
    public class ChangePasswordCommand : IRequest<bool>
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
