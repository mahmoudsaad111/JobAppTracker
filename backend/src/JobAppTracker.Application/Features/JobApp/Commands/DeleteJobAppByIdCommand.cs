using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.JobApp.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.JobApp.Commands
{
    public class DeleteJobAppByIdCommand : IRequest<DeleteJobAppByIdDto>
    {
        public Guid JobAppId { get; set; }
    }
}
