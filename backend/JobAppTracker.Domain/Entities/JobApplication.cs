using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Enums;
using JobAppTracker.Domain.ValueObjects;

namespace JobAppTracker.Domain.Entities
{
    public class JobApplication
    {
        public Guid Id { get; set; }

        public JobAppStatus Status { get; set; }
        public string? CompanyName { get; set; }
        public string? Title { get; set; }

        public string? Location { get; set; }
        public string? Description { get; set; }
        public string? Link { get; set; }
        public JobType Type { get; set; }
        public WorkMode WorkMode { get; set; }

        public DateTime AppliedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }

        /// foreign key to the Users table, indicating which user this job application belongs to
        public Guid UserId { get; set; }

        //navigation properties
        public User User { get; set; }
        public ICollection<Document> Documents { get; set; } = new List<Document>();
        public ICollection<Interview> Interviews { get; set; } = new List<Interview>();
        public ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
