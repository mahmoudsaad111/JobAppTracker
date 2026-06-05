using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Notes.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.Notes.Commands
{
    public class UpdateNoteCommand : IRequest<UpdateNoteDto>
    {
        public Guid NoteId { get; set; }
        public string Content { get; set; }
    }
}
