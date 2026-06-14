using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Text;
using JobAppTracker.Application.Features.Documents.Dtos;
using JobAppTracker.Domain.Entities;
using Document = JobAppTracker.Domain.Entities.Document;

namespace JobAppTracker.Application.Interfaces.Repositories
{
    public interface IDocumentRepository : IBaseRepository<Document>
    {
        public Task<GetUserDocumentsDto> GetByUserIdAsync(Guid userId);
    }
}
