using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobAppTracker.Application.Features.Documents.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using JobAppTracker.Domain.Entities;
using JobAppTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobAppTracker.Infrastructure.Repositories
{
    public class DocumentRespository : BaseRepository<Document>, IDocumentRepository
    {
        private readonly AppDbContext _appDbContext;

        public DocumentRespository(AppDbContext Context)
            : base(Context)
        {
            _appDbContext = Context;
        }

        public async Task<GetUserDocumentsDto> GetByUserIdAsync(Guid userId)
        {
            var documents = await _appDbContext
                .Documents.Where(d => d.UserId == userId)
                .OrderByDescending(d => d.CreatedAt)
                .Select(d => new GetDocumentDto // projection happens IN SQL
                {
                    Id = d.Id,
                    FileName = d.FileName,
                    FilePath = d.FilePath,
                    FileSize = d.FileSize,
                    Type = d.Type,
                    ContentType = d.ContentType,
                    CreatedAt = d.CreatedAt,
                })
                .ToListAsync();

            return new GetUserDocumentsDto { Documents = documents };
        }
    }
}
