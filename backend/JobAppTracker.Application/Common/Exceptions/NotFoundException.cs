using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace JobAppTracker.Application.Common.Exceptions
{
    public class NotFoundException : AppException
    {
        public NotFoundException(string message, List<string>? errors = null)
            : base(message, (int)HttpStatusCode.NotFound, errors) { }
    }
}
