using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Documents.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.Documents.Commands
{
    public class DeleteDocumentCommand : IRequest<DeleteDocumentDto>
    {
        public Guid DocumentId { get; set; }
    }
}
