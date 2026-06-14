using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Domain.Entities
{
    public class Note
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }

        /// foreign key to the Users table, indicating which user this note belongs to. A user can have multiple notes, but a note belongs to only one user. This allows users to write multiple notes under their account.
        public Guid UserId { get; set; }

        // forign key to the JobApplications table, indicating which job application this note is associated with. A note can be associated with multiple job applications, but a job application can have only one note. This allows users to write a single note and link it to multiple job applications if needed.
        public Guid? JobAppId { get; set; }

        // Nabigation properties
        public User User { get; set; }
        public JobApplication JobApplication { get; set; }
    }
}
