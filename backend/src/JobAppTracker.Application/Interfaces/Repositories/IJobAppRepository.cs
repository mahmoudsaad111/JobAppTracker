using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Entities;

namespace JobAppTracker.Application.Interfaces.Repositories
{
    public interface IJobAppRepository : IBaseRepository<JobApplication>
    {
        IQueryable<JobApplication> GetJobAppsForUser(Guid UserId);
    }
}
