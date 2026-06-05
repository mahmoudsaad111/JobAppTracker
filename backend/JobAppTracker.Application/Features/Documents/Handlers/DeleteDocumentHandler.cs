using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Exceptions;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.Documents.Commands;
using JobAppTracker.Application.Features.Documents.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using JobAppTracker.Application.Interfaces.Services;
using MediatR;

namespace JobAppTracker.Application.Features.Documents.Handlers
{
    public class DeleteDocumentHandler : IRequestHandler<DeleteDocumentCommand, DeleteDocumentDto>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IDocumentRepository _documentRepository;
        private readonly IFileStorageService _fileStorageService;

        public DeleteDocumentHandler(
            ICurrentUserService currentUserService,
            IDocumentRepository documentRepository,
            IFileStorageService fileStorageService
        )
        {
            _currentUserService = currentUserService;
            _documentRepository = documentRepository;
            _fileStorageService = fileStorageService;
        }

        public async Task<DeleteDocumentDto> Handle(
            DeleteDocumentCommand request,
            CancellationToken cancellationToken
        )
        {
            var UserId = _currentUserService.UserId;
            var result = await _documentRepository.GetByIdAsync(request.DocumentId);
            if (result == null || UserId != result.UserId)
                throw new NotFoundException("Document Not Found");

            _documentRepository.Delete(result);
            await _documentRepository.SaveChangesAsync();
            await _fileStorageService.DeleteAsync(result.FilePath);
            return new DeleteDocumentDto
            {
                IsDeleted = true,
                Message = "Document Deleted successfully",
            };
        }
    }
}
