using System.Security.Claims;
using JobAppTracker.Application.Common.Responses;
using JobAppTracker.Application.Features.Notes.Commands;
using JobAppTracker.Application.Features.Notes.Dtos;
using JobAppTracker.Application.Features.Notes.Queries;
using JobAppTracker.Application.Interfaces;
using JobAppTracker.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAppTracker.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/notes")]
    public class NotesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NotesController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNoteCommand command)
        {
            var note = await _mediator.Send(command);
            return Ok(ApiResponse<CreateNoteDto>.SuccessResult(note, "Note created successfully."));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] GetAllNotesQuery query)
        {
            var notes = await _mediator.Send(query);
            return Ok(
                ApiResponse<GetAllNotesDto>.SuccessResult(notes, "Notes retrieved successfully.")
            );
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(string id)
        {
            var result = await _mediator.Send(new DeleteNoteCommand { NoteId = Guid.Parse(id) });
            return Ok(
                ApiResponse<DeleteNoteDto>.SuccessResult(result, "Note deleted successfully.")
            );
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNote(string id)
        {
            var result = await _mediator.Send(new GetNoteQuery { NoteId = Guid.Parse(id) });
            return Ok(ApiResponse<GetNoteDto>.SuccessResult(result, "Success"));
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateNoteCommand command)
        {
            command.NoteId = Guid.Parse(id);
            var result = await _mediator.Send(command);
            return Ok(
                ApiResponse<UpdateNoteDto>.SuccessResult(result, "Note updated successfully.")
            );
        }
    }
}
