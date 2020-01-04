using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
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
                    throw new Exception($"Could not find activity with id {request.Id}");

                activity.Title = request.Title ?? activity.Title;
                activity.Category = request.Category ?? activity.Category;
                activity.City = request.City ?? activity.City;
                activity.Date = request.Date ?? activity.Date;
                activity.Venue = request.Venue ?? activity.Venue;
                activity.Description = request.Description ?? activity.Description;

                var result = await dataContext.SaveChangesAsync();
                if (result > 0)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}