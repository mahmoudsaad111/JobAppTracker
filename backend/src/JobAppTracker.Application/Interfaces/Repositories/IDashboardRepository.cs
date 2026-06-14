using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Dashboard.Dtos;

namespace JobAppTracker.Application.Interfaces.Repositories
{
    public interface IDashboardRepository
    {
        public Task<DashboardSummaryDto> GetDashboardSummaryAsync(string UserId);
    }
}
