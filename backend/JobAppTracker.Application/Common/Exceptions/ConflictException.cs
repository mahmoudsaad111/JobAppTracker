using System.Net;

namespace JobAppTracker.Application.Common.Exceptions;

public class ConflictException : AppException
{
    public ConflictException(string message = "Conflict", List<string>? errors = null)
        : base(message, (int)HttpStatusCode.Conflict, errors) { }
}
