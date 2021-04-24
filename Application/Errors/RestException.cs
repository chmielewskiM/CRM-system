using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public RestException(HttpStatusCode code, object errors = null)
        {
            Code = code;
            Errors = Data;
        }

        public HttpStatusCode Code { get; }
        public object Errors { get; }
    }

    public class NoChangesException : Exception
    {
    }
}