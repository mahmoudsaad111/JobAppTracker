using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

namespace JobAppTracker.Application.Interfaces.Repositories
{
    public interface IBaseRepository<T>
        where T : class
    {
        Task<List<T>> GetAllAsync();

        Task<T> GetByIdAsync(Guid id);

        Task<T> AddAsync(T entity);

        T Update(T entity);

        void Delete(T entity);

        Task SaveChangesAsync();
    }
}
