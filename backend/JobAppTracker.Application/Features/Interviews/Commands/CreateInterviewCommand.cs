using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Interviews.Dtos;
using JobAppTracker.Domain.Enums;
using MediatR;

namespace JobAppTracker.Application.Features.Interviews.Commands
{
    public class CreateInterviewCommand : IRequest<CreateInterviewDto>
    {
        public string JobAppId { get; set; }
        public InterviewType InterviewType { get; set; }
        public DateTime InterviewDate { get; set; }
        public string? InterviewerName { get; set; }
        public string Note { get; set; } = string.Empty;
        public string Feedback { get; set; } = string.Empty;
    }
}
