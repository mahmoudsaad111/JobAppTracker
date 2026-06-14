using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.Interviews.Commands;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.Interviews.Handlers
{
    public class DeleteInterviewHandler : IRequestHandler<DeleteInterviewCommand, bool>
    {
        private readonly IInterviewRepository _interviewRepository;
        private readonly ICurrentUserService _currentUserService;

        public DeleteInterviewHandler(
            IInterviewRepository interviewRepository,
            ICurrentUserService currentUserService
        )
        {
            _interviewRepository = interviewRepository;
            _currentUserService = currentUserService;
        }

        public async Task<bool> Handle(
            DeleteInterviewCommand request,
            CancellationToken cancellationToken
        )
        {
            var currentUserId = _currentUserService.UserId;
            var interview = await _interviewRepository.GetByIdAsync(request.InterviewId);
            if (interview == null || interview.UserId != currentUserId)
            {
                throw new NotFoundException("Interview Not Found");
            }
            _interviewRepository.Delete(interview);
            await _interviewRepository.SaveChangesAsync();

            return true;
        }
    }
}
