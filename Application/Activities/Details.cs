using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Domain;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext context;

            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync(request.Id);
                if (activity == null)
                    throw new HandlerUserException(
                        HandlerUserException.ErrorReason.NotFound,
                        "Could not find activity");

                return activity;
            }
        }
    }
}