using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Entities;

namespace JobAppTracker.Application.Interfaces.Repositories
{
    public interface INoteRepository : IBaseRepository<Note>
    {
        public Task<IEnumerable<Note>> GetNotesForUser(Guid userId);
        public Task<IEnumerable<Note>> GetNotesForJobApp(Guid jobAppId);
    }
}
