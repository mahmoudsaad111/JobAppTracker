using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.JobApp.Dtos;
using JobAppTracker.Domain.Enums;
using MediatR;

namespace JobAppTracker.Application.Features.JobApp.Commands
{
    public class UpdateJobAppStatusCommand : IRequest<UpdateJobAppStatusDto>
    {
        public Guid JobAppId { get; set; }
        public JobAppStatus Status { get; set; }
    }
}
