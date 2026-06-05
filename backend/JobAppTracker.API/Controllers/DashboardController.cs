using JobAppTracker.Application.Common.Responses;
using JobAppTracker.Application.Features.Dashboard.Dtos;
using JobAppTracker.Application.Features.Dashboard.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAppTracker.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/Dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> DashboardSummary()
        {
            var result = await _mediator.Send(new DashboardSummaryQuery());
            return Ok(ApiResponse<DashboardSummaryDto>.SuccessResult(result, "success"));
        }
    }
}
