using System.Net;

namespace JobAppTracker.Application.Common.Exceptions;

public class BadRequestException : AppException
{
    public BadRequestException(string message, List<string>? errors = null)
        : base(message, (int)HttpStatusCode.BadRequest, errors) { }
}
