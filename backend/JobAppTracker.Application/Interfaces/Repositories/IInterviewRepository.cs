using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Entities;

namespace JobAppTracker.Application.Interfaces.Repositories
{
    public interface IInterviewRepository : IBaseRepository<Interview>
    {
        Task<IEnumerable<Interview>> GetInterviewsForJobAppAsync(Guid JobAppId);
        Task<IEnumerable<Interview>> GetInterviewsForUserAsync(Guid UserId);
    }
}
