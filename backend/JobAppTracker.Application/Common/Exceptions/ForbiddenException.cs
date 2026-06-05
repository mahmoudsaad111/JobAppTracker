using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace JobAppTracker.Application.Common.Exceptions
{
    public class ForbiddenException : AppException
    {
        public ForbiddenException(string message = "Forbidden", List<string>? errors = null)
            : base(message, (int)HttpStatusCode.Forbidden, errors) { }
    }
}
