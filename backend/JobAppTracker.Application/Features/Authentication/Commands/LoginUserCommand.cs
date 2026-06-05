using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Authentication.Commands
{
    public class LoginUserCommand : MediatR.IRequest<DTOs.LoginUserDto>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
