using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Materials
{
    public class Edit
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
                var material = await _context.Materials.FindAsync(request.Id);

                if (material == null)
                    throw new Exception("Could not find material");

                material.Name = request.Name ?? material.Name;
                material.Storehouse = request.Storehouse ?? material.Storehouse;
                material.Available = request.Available;
                material.Deployed = request.Deployed;
                material.Ordered = request.Ordered;
                material.Required = request.Required;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}