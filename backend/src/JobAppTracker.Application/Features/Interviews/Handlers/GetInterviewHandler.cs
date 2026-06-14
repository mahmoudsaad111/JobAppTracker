using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Features.Interviews.Dtos;
using JobAppTracker.Application.Features.Interviews.Queries;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.Interviews.Handlers
{
    public class GetInterviewHandler : IRequestHandler<GetInterviewQuery, GetInterviewDto>
    {
        private readonly IInterviewRepository _interviewRepository;

        public GetInterviewHandler(IInterviewRepository interviewRepository)
        {
            _interviewRepository = interviewRepository;
        }

        public async Task<GetInterviewDto> Handle(
            GetInterviewQuery request,
            CancellationToken cancellationToken
        )
        {
            var interview = await _interviewRepository.GetByIdAsync(request.InterviewId);
            if (interview == null)
            {
                throw new NotFoundException("Interview not found");
            }
            return new GetInterviewDto
            {
                InterviewId = interview.Id,
                JobAppId = interview.JobAppId,
                InterviewDate = interview.InterviewDate,
                InterviewType = interview.InterviewType,
                Note = interview.Note,
                Feedback = interview.Feedback,
            };
        }
    }
}
