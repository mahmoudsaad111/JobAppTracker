using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Dashboard.Dtos
{
    public class DashboardSummaryDto
    {
        public int TotalApplications { get; set; }
        public int ThisWeekApplications { get; set; }
        public double ResponseRate { get; set; }
        public StatusBreakdownDto ByStatus { get; set; } = new();
        public List<UpcomingInterviewDto> UpcomingInterviews { get; set; } = new();
        public List<RecentApplicationDto> RecentApplications { get; set; } = new();
    }

    public class StatusBreakdownDto
    {
        public int Applied { get; set; }
        public int Interviewing { get; set; }
        public int Offered { get; set; }
        public int Rejected { get; set; }
        public int Withdrawn { get; set; }
    }

    public class UpcomingInterviewDto
    {
        public Guid Id { get; set; }
        public string Company { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime InterviewDate { get; set; }
        public string InterviewType { get; set; } = string.Empty;
    }

    public class RecentApplicationDto
    {
        public Guid JobAppId { get; set; }
        public string Company { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime AppliedDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
