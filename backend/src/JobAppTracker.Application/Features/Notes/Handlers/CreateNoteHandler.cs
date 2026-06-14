using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.Notes.Commands;
using JobAppTracker.Application.Features.Notes.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using JobAppTracker.Domain.Entities;
using MediatR;

namespace JobAppTracker.Application.Features.Notes.Handlers
{
    public class CreateNoteHandler : IRequestHandler<CreateNoteCommand, CreateNoteDto>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly INoteRepository _noteRepository;

        public CreateNoteHandler(
            ICurrentUserService currentUserService,
            INoteRepository noteRepository
        )
        {
            _currentUserService = currentUserService;
            _noteRepository = noteRepository;
        }

        public async Task<CreateNoteDto> Handle(
            CreateNoteCommand request,
            CancellationToken cancellationToken
        )
        {
            var userId = _currentUserService.UserId;
            var NewNote = await _noteRepository.AddAsync(
                new Note
                {
                    Content = request.Content,
                    JobAppId = request.JobAppId,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                }
            );

            await _noteRepository.SaveChangesAsync();

            return new CreateNoteDto
            {
                NoteId = NewNote.Id,
                NoteContent = NewNote.Content,
                CreatedAt = NewNote.CreatedAt,
                UpdatedAt = NewNote.UpdatedAt,
            };
        }
    }
}
