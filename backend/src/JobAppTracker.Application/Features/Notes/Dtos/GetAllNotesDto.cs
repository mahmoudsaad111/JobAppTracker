using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Application.Features.Notes.Dtos
{
    public class GetAllNotesDto
    {
        public IEnumerable<GetNoteDto> Notes { get; set; }
    }
}
