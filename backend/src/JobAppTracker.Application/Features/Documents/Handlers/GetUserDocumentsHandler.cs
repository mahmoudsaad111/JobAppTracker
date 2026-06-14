using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.Documents.Dtos;
using JobAppTracker.Application.Features.Documents.Queries;
using JobAppTracker.Application.Features.JobApp.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.Documents.Handlers
{
    public class GetUserDocumentsHandler
        : IRequestHandler<GetUserDocumentsQuery, GetUserDocumentsDto>
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly ICurrentUserService _currentUserService;

        public GetUserDocumentsHandler(
            IDocumentRepository documentRepository,
            ICurrentUserService currentUserService
        )
        {
            _documentRepository = documentRepository;
            _currentUserService = currentUserService;
        }

        public async Task<GetUserDocumentsDto> Handle(
            GetUserDocumentsQuery request,
            CancellationToken cancellationToken
        )
        {
            var userId = _currentUserService.UserId;
            var docs = await _documentRepository.GetByUserIdAsync(userId);

            return docs;
        }
    }
}
