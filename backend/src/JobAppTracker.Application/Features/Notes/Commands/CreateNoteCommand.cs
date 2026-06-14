using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Notes.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.Notes.Commands
{
    public class CreateNoteCommand : IRequest<CreateNoteDto>
    {
        public string Content { get; set; }

        public Guid? JobAppId { get; set; }
    }
}
