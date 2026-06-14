using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Authentication.DTOs;
using MediatR;

namespace JobAppTracker.Application.Features.Authentication.Commands
{
    public record RegisterUserCommand : IRequest<RegisterResultDto>
    {
        public string? UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
