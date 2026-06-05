using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Common.Interfaces;
using JobAppTracker.Application.Features.Interviews.Dtos;
using JobAppTracker.Application.Features.Notes.Dtos;
using JobAppTracker.Application.Features.Notes.Queries;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.Notes.Handlers
{
    public class GetAllNotesHandler : IRequestHandler<GetAllNotesQuery, GetAllNotesDto>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly INoteRepository _noteRepository;

        public GetAllNotesHandler(
            ICurrentUserService currentUserService,
            INoteRepository noteRepository
        )
        {
            _currentUserService = currentUserService;
            _noteRepository = noteRepository;
        }

        public async Task<GetAllNotesDto> Handle(
            GetAllNotesQuery request,
            CancellationToken cancellationToken
        )
        {
            var userId = _currentUserService.UserId;
            var notes = await _noteRepository.GetNotesForUser(userId);
            return new GetAllNotesDto
            {
                Notes = notes
                    .Select(n => new GetNoteDto
                    {
                        NoteId = n.Id,
                        Content = n.Content,
                        CreatedAt = n.CreatedAt,
                        JobAppId = n.JobAppId,
                        UpdatedAt = n.UpdatedAt,
                    })
                    .ToList(),
            };
        }
    }
}
