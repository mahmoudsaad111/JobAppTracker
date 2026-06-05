using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Enums;

namespace JobAppTracker.Domain.Entities
{
    public class Interview
    {
        public Guid Id { get; set; }
        public string? InterviewerName { get; set; }

        public InterviewType InterviewType { get; set; }
        public DateTime InterviewDate { get; set; }
        public string? Note { get; set; } = string.Empty;
        public string? Feedback { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }

        //foreign key to the JobApplications table, indicating which job application this interview is associated with. A job application can have multiple interviews, but an interview can be associated with only one job application. This allows users to schedule multiple interviews for a single job application if needed.
        public Guid JobAppId { get; set; }

        // foreign key to the Users table, indicating which user this interview belongs to. A user can have multiple interviews, but an interview belongs to only one user. This allows users to schedule multiple interviews under their account.
        public Guid UserId { get; set; }

        // Nabigation properties
        public User User { get; set; }
        public JobApplication JobApplication { get; set; }
    }
}
