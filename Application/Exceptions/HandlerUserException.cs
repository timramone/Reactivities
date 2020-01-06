using System;

namespace Application.Exceptions
{
    public class HandlerUserException : Exception
    {
        public enum ErrorReason
        {
            NotFound
        }
        public ErrorReason Reason { get; }

        public HandlerUserException(ErrorReason reason, string message) : base(message)
        {
            this.Reason = reason;
        }
    }
}