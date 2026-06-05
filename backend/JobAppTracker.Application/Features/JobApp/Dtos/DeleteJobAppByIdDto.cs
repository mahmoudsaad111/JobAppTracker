using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.JobApp.Dtos
{
    public class DeleteJobAppByIdDto
    {
        public bool IsDeleted { get; set; }
        public string Message { get; set; }
    }
}
