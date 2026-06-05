using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Notes.Dtos
{
    public class GetNoteDto
    {
        public Guid NoteId { get; set; }
        public Guid? JobAppId { get; set; }
        public Guid UserId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
