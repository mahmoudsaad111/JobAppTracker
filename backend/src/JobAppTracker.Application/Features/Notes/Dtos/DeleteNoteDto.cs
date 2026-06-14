using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Notes.Dtos
{
    public class DeleteNoteDto
    {
        public bool IsDeleted { get; set; }
        public string Message { get; set; }
    }
}
