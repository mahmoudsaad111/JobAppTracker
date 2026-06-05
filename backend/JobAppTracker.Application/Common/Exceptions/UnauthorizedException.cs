using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace JobAppTracker.Application.Common.Exceptions
{
    public class UnauthorizedException : AppException
    {
        public UnauthorizedException(string message = "Unauthorized", List<string>? errors = null)
            : base(message, (int)HttpStatusCode.Unauthorized, errors) { }
    }
}
