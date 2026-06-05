using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.JobApp.Commands;
using JobAppTracker.Application.Features.JobApp.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.JobApp.Handlers
{
    public class UpdateJobAppHandler : IRequestHandler<UpdateJobAppCommand, UpdateJobAppDto>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IJobAppRepository _jobAppRepository;

        public UpdateJobAppHandler(
            ICurrentUserService currentUserService,
            IJobAppRepository jobAppRepository
        )
        {
            _currentUserService = currentUserService;
            _jobAppRepository = jobAppRepository;
        }

        public async Task<UpdateJobAppDto> Handle(
            UpdateJobAppCommand request,
            CancellationToken cancellationToken
        )
        {
            var userId = _currentUserService.UserId;
            var jobApp = await _jobAppRepository.GetByIdAsync(request.JobAppId);

            jobApp.CompanyName = request.CompanyName;
            jobApp.Title = request.Title;
            jobApp.Location = request.Location;
            jobApp.Link = request.JobLink;
            jobApp.Status = request.Status;
            jobApp.Description = request.Description;
            jobApp.UpdatedAt = DateTime.UtcNow;

            var UpdatedJobApp = _jobAppRepository.Update(jobApp);
            await _jobAppRepository.SaveChangesAsync();

            return new UpdateJobAppDto
            {
                JobAppId = UpdatedJobApp.Id,
                CompanyName = UpdatedJobApp.CompanyName,
                Title = UpdatedJobApp.Title,
                Location = UpdatedJobApp.Location,
                JobLink = UpdatedJobApp.Link,
                AppliedAt = UpdatedJobApp.AppliedAt,
                Status = UpdatedJobApp.Status,
                Description = UpdatedJobApp.Description,
            };
        }
    }
}
