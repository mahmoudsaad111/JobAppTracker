using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Enums;

namespace JobAppTracker.Application.Features.Interviews.Dtos
{
    public class GetInterviewDto
    {
        public Guid InterviewId { get; set; }
        public Guid JobAppId { get; set; }
        public DateTime InterviewDate { get; set; }
        public InterviewType InterviewType { get; set; }
        public string InterviewerName { get; set; }
        public string Note { get; set; }
        public string Feedback { get; set; }
    }
}
