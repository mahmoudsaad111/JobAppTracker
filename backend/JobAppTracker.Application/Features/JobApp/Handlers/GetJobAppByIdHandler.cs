using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.JobApp.Dtos;
using JobAppTracker.Application.Features.JobApp.Queries;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.JobApp.Handlers
{
    public class GetJobAppByIdHandler : IRequestHandler<GetJobAppByIdQuery, GetJobAppByIdDto>
    {
        private readonly IJobAppRepository _jobAppRepository;
        private readonly ICurrentUserService _currentUserService;

        public GetJobAppByIdHandler(
            IJobAppRepository jobAppRepository,
            ICurrentUserService currentUserService
        )
        {
            _jobAppRepository = jobAppRepository;
            _currentUserService = currentUserService;
        }

        public async Task<GetJobAppByIdDto> Handle(
            GetJobAppByIdQuery request,
            CancellationToken cancellationToken
        )
        {
            var result = await _jobAppRepository.GetByIdAsync(request.JobAppId);
            var userId = _currentUserService.UserId;

            if (result == null || result.UserId != userId)
                throw new NotFoundException("Job application not found");

            return new GetJobAppByIdDto
            {
                JobAppId = result.Id,
                CompanyName = result.CompanyName,
                Title = result.Title,
                Description = result.Description,
                JobLink = result.Link,
                Type = result.Type,
                WorkMode = result.WorkMode,
                Location = result.Location,
                AppliedAt = result.AppliedAt,
                CreatedAt = result.CreatedAt,
                UpdatedAt = result.UpdatedAt,
                Status = result.Status,
                Interviews = result
                    .Interviews.Select(i => new InterviewDto
                    {
                        InterviewId = i.Id,
                        InterviewerName = i.InterviewerName,
                        InterviewType = i.InterviewType,
                        InterviewDate = i.InterviewDate,
                        Note = i.Note,
                        Feedback = i.Feedback,
                    })
                    .ToList(),
            };
        }
    }
}
