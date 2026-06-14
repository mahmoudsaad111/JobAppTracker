using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Documents.Dtos
{
    public class GetUserDocumentsDto
    {
        public IEnumerable<GetDocumentDto> Documents { get; set; }
    }
}
