using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Authentication.Commands;
using JobAppTracker.Application.Features.Authentication.DTOs;
using JobAppTracker.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace JobAppTracker.Application.Features.Authentication.Handlers
{
    public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand, ResetPasswordDto>
    {
        private readonly UserManager<User> _userManager;

        public ResetPasswordHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ResetPasswordDto> Handle(
            ResetPasswordCommand request,
            CancellationToken cancellationToken
        )
        {
            if (request.NewPassword != request.ConfirmNewPassword)
                return new ResetPasswordDto
                {
                    Success = false,
                    Message = "Passwords do not match.",
                };

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null)
                return new ResetPasswordDto { Success = false, Message = "Invalid request." };

            var decodedToken = Uri.UnescapeDataString(request.Token);
            var result = await _userManager.ResetPasswordAsync(
                user,
                decodedToken,
                request.NewPassword
            );

            if (!result.Succeeded)
            {
                var errors = string.Join(" ", result.Errors.Select(e => e.Description));
                return new ResetPasswordDto { Success = false, Message = errors };
            }

            return new ResetPasswordDto
            {
                Success = true,
                Message = "Password reset successfully. You can now sign in.",
            };
        }
    }
}
