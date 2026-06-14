using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Interfaces.Repositories;
using JobAppTracker.Domain.Entities;
using JobAppTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobAppTracker.Infrastructure.Repositories
{
    public class InterviewRepository : BaseRepository<Interview>, IInterviewRepository
    {
        private readonly AppDbContext _appDbContext;

        public InterviewRepository(AppDbContext Context)
            : base(Context)
        {
            _appDbContext = Context;
        }

        public async Task<IEnumerable<Interview>> GetInterviewsForUserAsync(Guid UserId)
        {
            var result = await _appDbContext
                .Interviews.Where(i => i.UserId == UserId)
                .Include(i => i.JobApplication)
                .ToListAsync();
            return await Task.FromResult((IEnumerable<Interview>)result);
        }

        public async Task<IEnumerable<Interview>> GetInterviewsForJobAppAsync(Guid JobAppId)
        {
            var result = await _appDbContext
                .Interviews.Where(i => i.JobAppId == JobAppId)
                .ToListAsync();
            return await Task.FromResult((IEnumerable<Interview>)result);
        }
    }
}
