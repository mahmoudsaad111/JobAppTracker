using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Enums;
using JobAppTracker.Domain.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace JobAppTracker.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public Gender? Gender { get; set; }
        public Location? Location { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public string? CurrentJobTitle { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? CurrentCompany { get; set; }

        // navigation properties
        public ICollection<JobApplication> JobApplications { get; set; } =
            new List<JobApplication>();
        public ICollection<Note> Notes { get; set; } = new List<Note>();
        public ICollection<Document> Documents { get; set; } = new List<Document>();
        public ICollection<Interview> Interviews { get; set; } = new List<Interview>();
    }
}
