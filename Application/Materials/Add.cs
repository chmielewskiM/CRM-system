using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;

namespace Application.Materials
{
    public class Add
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Storehouse { get; set; }
            public Double Available { get; set; }
            public Double Deployed { get; set; }
            public Double Ordered { get; set; }
            public Double Required { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var material = new Material
                {
                    Id = request.Id,
                    Name = request.Name,
                    Storehouse = request.Storehouse,
                    Available = request.Available,
                    Deployed = request.Deployed,
                    Ordered = request.Ordered,
                    Required = request.Required,
                };

                _context.Materials.Add(material);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}