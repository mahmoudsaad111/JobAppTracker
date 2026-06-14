using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Documents.Dtos;
using JobAppTracker.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace JobAppTracker.Application.Features.Documents.Commands
{
    public class UploadDocumentCommand : IRequest<UploadDocumentDto>
    {
        public IFormFile File { get; set; }
        public string Type { get; set; }
    }
}
