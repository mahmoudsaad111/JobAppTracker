using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Notes.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.Notes.Queries
{
    public class GetAllNotesQuery : IRequest<GetAllNotesDto> { }
}
