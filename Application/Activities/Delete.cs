using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext dataContext;

            public Handler(DataContext dataContext)
            {
                this.dataContext = dataContext;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await dataContext.Activities.FindAsync(request.Id);
                if (activity == null)
                    throw new HandlerUserException(
                        HandlerUserException.ErrorReason.NotFound,
                        "Could not find activity");

                dataContext.Activities.Remove(activity);

                var result = await dataContext.SaveChangesAsync();

                if (result > 0)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");
            }
        }
    }
}