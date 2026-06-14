using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Dashboard.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.Dashboard.Queries
{
    public class DashboardSummaryQuery : IRequest<DashboardSummaryDto> { }
}
