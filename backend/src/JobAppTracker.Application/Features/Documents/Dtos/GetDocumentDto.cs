using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Enums;

namespace JobAppTracker.Application.Features.Documents.Dtos
{
    public class GetDocumentDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        public ContentType ContentType { get; set; }
        public DocumentType Type { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
