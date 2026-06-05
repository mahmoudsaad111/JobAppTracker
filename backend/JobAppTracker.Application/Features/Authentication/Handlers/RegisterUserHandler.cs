using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Features.Authentication.Commands;
using JobAppTracker.Application.Features.Authentication.DTOs;
using JobAppTracker.Application.Interfaces.Repositories;
using JobAppTracker.Application.Interfaces.Services.Email;
using JobAppTracker.Application.Interfaces.Services.Frontend;
using JobAppTracker.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace JobAppTracker.Application.Features.Authentication.Handlers
{
    public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, RegisterResultDto>
    {
        private readonly UserManager<User> _usermanager;
        private readonly IEmailService _emailService;
        private readonly IFrontendUrlService _frontendUrlService;

        public RegisterUserHandler(
            UserManager<User> userManager,
            IEmailService emailService,
            IFrontendUrlService frontendUrlService
        )
        {
            _usermanager = userManager;
            _emailService = emailService;
            _frontendUrlService = frontendUrlService;
        }

        public async Task<RegisterResultDto> Handle(
            RegisterUserCommand request,
            CancellationToken cancellationToken
        )
        {
            // 1. Check if email already exists
            if (await _usermanager.FindByEmailAsync(request.Email) != null)
                throw new BadRequestException("Email already in use");

            // 2. Create user
            var user = new User
            {
                Email = request.Email,
                UserName = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
            };

            // 3. Save to DB
            var result = await _usermanager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                throw new ValidationException(
                    "User creation failed",
                    result.Errors.Select(e => e.Description).ToList()
                );
            }

            // Optionally assign default role here, e.g. "User"
            await _usermanager.AddToRoleAsync(user, "User");

            // 4. Generate email confirmation token and send email
            var token = await _usermanager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);
            var link = _frontendUrlService.EmailConfirmation(user.Id.ToString(), encodedToken);

            await _emailService.SendEmailAsync(
                user.Email,
                "Verify your email",
                $"Click here: <a href='{link}'>Verify Email</a>"
            );

            // 5. Return result
            return new RegisterResultDto { Email = user.Email };
        }
    }
}
