using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using JobAppTracker.Domain.Enums;

namespace JobAppTracker.Domain.Entities
{
    public class Document
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }

        public string FilePath { get; set; }
        public long FileSize { get; set; }

        public DocumentType Type { get; set; }

        public ContentType ContentType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }

        // foreign key to the JobApplications table, indicating which job application this document is associated with. A document can be associated with one job application, but a job application can have multiple documents. This allows users to upload multiple documents (like resumes, cover letters, etc.) for each job application.

        public Guid? JobApplicationId { get; set; }

        // foreign key to the Users table, indicating which user this document belongs to. A user can have multiple documents, but a document belongs to only one user. This allows users to upload multiple documents under their account.
        public Guid UserId { get; set; }

        // Navigation properties
        public User User { get; set; }
        public JobApplication? JobApplication { get; set; }
    }
}
