using System;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ErrorHandlingMiddleware> logger;

        public ErrorHandlingMiddleware(
        RequestDelegate next,
        ILogger<ErrorHandlingMiddleware> logger)
        {
            this.logger = logger;
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, logger);
            }
        }

        private async Task HandleExceptionAsync(
            HttpContext context,
            Exception ex,
            ILogger<ErrorHandlingMiddleware> logger)
        {
            object errors = null;

            switch (ex)
            {
                case HandlerUserException he:
                    logger.Log(LogLevel.Information, ex, "HANDLER EXCEPTION ERROR");
                    errors = he.Message;
                    context.Response.StatusCode = GetHandlerExceptionStatusCode(he);
                    break;
                case Exception e:
                    logger.LogError(ex, "SERVER ERROR");
                    errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    break;
            }

            context.Response.ContentType = "application/json";
            if (errors != null)
            {
                var result = JsonSerializer.Serialize(new
                {
                    errors
                });

                await context.Response.WriteAsync(result);
            }
        }

        private int GetHandlerExceptionStatusCode(HandlerUserException he)
        {
            switch (he.Reason)
            {
                case HandlerUserException.ErrorReason.NotFound:
                    return (int)StatusCodes.Status404NotFound;
            }

            throw new NotSupportedException($"Reason {he.Reason} is not supported");
        }
    }
}