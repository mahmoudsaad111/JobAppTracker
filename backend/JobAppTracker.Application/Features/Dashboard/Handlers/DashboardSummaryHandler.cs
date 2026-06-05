using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.Dashboard.Dtos;
using JobAppTracker.Application.Features.Dashboard.Queries;
using JobAppTracker.Application.Features.JobApp.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.Dashboard.Handlers
{
    public class DashboardSummaryHandler
        : IRequestHandler<DashboardSummaryQuery, DashboardSummaryDto>
    {
        private readonly IDashboardRepository _dashboardRepository;
        private readonly ICurrentUserService _currentUserService;

        public DashboardSummaryHandler(
            IDashboardRepository dashboardRepository,
            ICurrentUserService currentUserService
        )
        {
            _dashboardRepository = dashboardRepository;
            _currentUserService = currentUserService;
        }

        public async Task<DashboardSummaryDto> Handle(
            DashboardSummaryQuery request,
            CancellationToken cancellationToken
        )
        {
            var userId = _currentUserService.UserId;
            var summary = await _dashboardRepository.GetDashboardSummaryAsync(userId.ToString());
            return summary;
        }
    }
}
