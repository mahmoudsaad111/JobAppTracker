using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace JobAppTracker.Application.Common.Exceptions
{
    public class ValidationException : AppException
    {
        public ValidationException(string message, List<string>? errors = null)
            : base(message, (int)HttpStatusCode.BadRequest, errors) { }
    }
}
