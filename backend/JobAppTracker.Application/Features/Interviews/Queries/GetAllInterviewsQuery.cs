using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Features.Interviews.Dtos;
using MediatR;

namespace JobAppTracker.Application.Features.Interviews.Queries
{
    public class GetAllInterviewsQuery : IRequest<IEnumerable<GetAllInterviewsDto>> { }
}
