using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Domain.Enums
{
    public enum JobAppStatus
    {
        Draft,
        Submitted,
        UnderReview,
        InterviewScheduled,
        Interviewed,
        Accepted,
        Rejected,
        Withdrawn,
    }
}
