using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Interviews.Dtos;
using JobAppTracker.Domain.Enums;
using MediatR;

namespace JobAppTracker.Application.Features.Interviews.Commands
{
    public class UpdateInterviewCommand : IRequest<UpdateInterviewDto>
    {
        public Guid InterviewId { get; set; }
        public Guid? JobAppId { get; set; }
        public DateTime InterviewDate { get; set; }
        public InterviewType InterviewType { get; set; }

        public string? InterviewerName { get; set; }
        public string? Note { get; set; }
        public string? Feedback { get; set; }
    }
}
