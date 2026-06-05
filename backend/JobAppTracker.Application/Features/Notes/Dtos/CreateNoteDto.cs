using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Notes.Dtos
{
    public class CreateNoteDto
    {
        public Guid NoteId { get; set; }
        public string NoteContent { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
