using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Features.Authentication.Commands;
using JobAppTracker.Application.Features.Authentication.DTOs;
using JobAppTracker.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace JobAppTracker.Application.Features.Authentication.Handlers
{
    public class VerifyEmailHandler : IRequestHandler<VerifyEmailCommand, VerifyEmailDto>
    {
        private readonly UserManager<User> _userManager;

        public VerifyEmailHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<VerifyEmailDto> Handle(
            VerifyEmailCommand request,
            CancellationToken cancellationToken
        )
        {
            var user = await _userManager.FindByIdAsync(request.UserId.ToString());
            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            if (user.EmailConfirmed)
            {
                throw new BadRequestException("Email is already confirmed");
            }

            var result = await _userManager.ConfirmEmailAsync(user, request.Token);

            if (result.Succeeded)
            {
                return new VerifyEmailDto
                {
                    IsSuccess = true,
                    Message = "Email verified successfully",
                };
            }
            else
            {
                throw new BadRequestException("Invalid token");
            }
        }
    }
}
