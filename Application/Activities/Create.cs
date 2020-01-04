using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
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
                var activity = new Activity
                {
                    Id = request.Id,
                    Category = request.Category,
                    Title = request.Title,
                    City = request.City,
                    Date = request.Date,
                    Venue = request.Venue,
                    Description = request.Description,
                };

                dataContext.Activities.Add(activity);
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