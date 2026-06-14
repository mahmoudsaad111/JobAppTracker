using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Enums;

namespace JobAppTracker.Application.Features.JobApp.Dtos
{
    public class GetJobAppForUserDto
    {
        public Guid JobAppId { get; set; }

        public string CompanyName { get; set; }

        public string Title { get; set; }

        public DateTime AppliedAt { get; set; }

        public JobAppStatus Status { get; set; }

        public WorkMode WorkMode { get; set; }
    }
}
