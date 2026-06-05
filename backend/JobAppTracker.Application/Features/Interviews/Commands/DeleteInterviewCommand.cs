using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace JobAppTracker.Application.Features.Interviews.Commands
{
    public class DeleteInterviewCommand : IRequest<bool>
    {
        public Guid InterviewId { get; set; }
    }
}
