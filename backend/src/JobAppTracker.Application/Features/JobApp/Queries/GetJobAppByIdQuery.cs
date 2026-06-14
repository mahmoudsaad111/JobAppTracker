using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.JobApp.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.JobApp.Queries
{
    public class GetJobAppByIdQuery : IRequest<GetJobAppByIdDto>
    {
        public Guid JobAppId;
    }
}
