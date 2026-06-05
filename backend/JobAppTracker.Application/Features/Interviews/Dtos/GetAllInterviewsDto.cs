using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace JobAppTracker.Application.Features.Interviews.Dtos
{
    public class GetAllInterviewsDto
    {
        // Interview fields (matches frontend Interview interface)
        public Guid InterviewId { get; set; }
        public Guid IobAppId { get; set; } // kept as-is to match frontend typo
        public DateTime InterviewDate { get; set; }
        public string InterviewType { get; set; } = string.Empty;
        public string? InterviewerName { get; set; }
        public string Note { get; set; } = string.Empty;
        public string Feedback { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Nested job application info (what the frontend card displays)
        public JobApplicationSummaryDto JobApplication { get; set; } = new();
    }

    public class JobApplicationSummaryDto
    {
        public Guid JobAppId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string WorkMode { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Link { get; set; }
    }
}
