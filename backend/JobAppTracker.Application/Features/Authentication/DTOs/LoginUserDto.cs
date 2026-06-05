using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace JobAppTracker.Application.Features.Authentication.DTOs
{
    public class LoginUserDto
    {
        public string? Email { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
        public bool IsSuccess { get; set; } = false;
        public Guid? UserId { get; set; }
        public string? Role { get; set; } = null;
        public string? Message { get; set; }
    }
}
