using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.JobApp.Commands;
using JobAppTracker.Application.Features.JobApp.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.JobApp.Handlers
{
    public class DeleteJobAppByIdHanlder
        : IRequestHandler<DeleteJobAppByIdCommand, DeleteJobAppByIdDto>
    {
        private readonly IJobAppRepository _jobAppRepository;
        private readonly ICurrentUserService _currentUserService;

        public DeleteJobAppByIdHanlder(
            IJobAppRepository jobAppRepository,
            ICurrentUserService currentUserService
        )
        {
            _jobAppRepository = jobAppRepository;
            _currentUserService = currentUserService;
        }

        public async Task<DeleteJobAppByIdDto> Handle(
            DeleteJobAppByIdCommand request,
            CancellationToken cancellationToken
        )
        {
            var entity = await _jobAppRepository.GetByIdAsync(request.JobAppId);
            var userId = _currentUserService.UserId;

            if (entity == null || entity.UserId != userId)
                throw new NotFoundException("Job application not found");

            _jobAppRepository.Delete(entity);
            await _jobAppRepository.SaveChangesAsync();
            return new DeleteJobAppByIdDto
            {
                IsDeleted = true,
                Message = "Job application deleted successfully.",
            };
        }
    }
}
