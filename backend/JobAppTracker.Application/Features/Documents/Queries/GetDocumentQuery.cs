using JobAppTracker.Application.Features.Documents.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using MediatR;

namespace JobAppTracker.Application.Features.Documents.Queries
{
    public class GetUserDocumentsQuery : IRequest<GetUserDocumentsDto> { }
}
