using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Documents.Dtos
{
    public class DeleteDocumentDto
    {
        public bool IsDeleted { get; set; }
        public string? Message { get; set; }
    }
}
