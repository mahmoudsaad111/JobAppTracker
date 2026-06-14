using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Interviews.Dtos;
using JobAppTracker.Domain.Enums;
using MediatR;

namespace JobAppTracker.Application.Features.Interviews.Queries
{
    public class GetInterviewQuery : IRequest<GetInterviewDto>
    {
        public Guid InterviewId { get; set; }
    }
}
