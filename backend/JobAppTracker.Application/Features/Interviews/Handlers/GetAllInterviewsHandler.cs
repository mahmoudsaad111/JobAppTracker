using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Common.Responses;
using JobAppTracker.Application.Features.Interviews.Dtos;
using JobAppTracker.Application.Features.Interviews.Queries;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;
using MediatR.Pipeline;
using Microsoft.AspNetCore.Http;

namespace JobAppTracker.Application.Features.Interviews.Handlers
{
    public class GetAllInterviewsHandler
        : IRequestHandler<GetAllInterviewsQuery, IEnumerable<GetAllInterviewsDto>>
    {
        private IInterviewRepository _interviewRepository;
        private readonly ICurrentUserService _currentUserService;

        public GetAllInterviewsHandler(
            IInterviewRepository interviewRepository,
            ICurrentUserService currentUserService
        )
        {
            _interviewRepository = interviewRepository;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<GetAllInterviewsDto>> Handle(
            GetAllInterviewsQuery request,
            CancellationToken cancellationToken
        )
        {
            // Get the current user's id from JWT claims
            var userId = _currentUserService.UserId;
            var interviews = await _interviewRepository.GetInterviewsForUserAsync(userId);

            var dtos = interviews.Select(i => new GetAllInterviewsDto
            {
                InterviewId = i.Id,
                IobAppId = i.JobAppId,
                InterviewDate = i.InterviewDate,
                InterviewType = i.InterviewType.ToString(),
                InterviewerName = i.InterviewerName,
                Note = i.Note ?? string.Empty,
                Feedback = i.Feedback ?? string.Empty,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt,

                JobApplication =
                    i.JobApplication == null
                        ? new()
                        : new JobApplicationSummaryDto
                        {
                            JobAppId = i.JobApplication.Id,
                            CompanyName = i.JobApplication.CompanyName ?? string.Empty,
                            Title = i.JobApplication.Title ?? string.Empty,
                            Location = i.JobApplication.Location ?? string.Empty,
                            Status = i.JobApplication.Status.ToString(),
                            WorkMode = i.JobApplication.WorkMode.ToString(),
                            Type = i.JobApplication.Type.ToString(),
                            Link = i.JobApplication.Link,
                        },
            });

            return dtos;
        }
    }
}
