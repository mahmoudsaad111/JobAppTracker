using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.Authentication.Commands;
using JobAppTracker.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;

namespace JobAppTracker.Application.Features.Authentication.Handlers
{
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
    {
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUserService _currentUserService;

        public ChangePasswordCommandHandler(
            UserManager<User> userManager,
            ICurrentUserService currentUserService
        )
        {
            _userManager = userManager;
            _currentUserService = currentUserService;
        }

        public async Task<bool> Handle(
            ChangePasswordCommand request,
            CancellationToken cancellationToken
        )
        {
            var userId = _currentUserService.UserId;

            var user = await _userManager.FindByIdAsync((userId.ToString()));

            if (user == null)
                throw new UnauthorizedException("User not found.");

            var result = await _userManager.ChangePasswordAsync(
                user,
                request.CurrentPassword,
                request.NewPassword
            );

            if (!result.Succeeded)
                throw new BadRequestException(
                    "Failed to change password. Please ensure the current password is correct and the new password meets the requirements."
                );

            return true;
        }
    }
}
