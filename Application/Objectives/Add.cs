using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;

namespace Application.Objectives
{
    public class Add
    {
        public class Command : IRequest
        {
        public Guid Id { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }             
        public string Assignation { get; set; }
        public DateTime Deadline { get; set; }
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
                var objective = new Objective
                {
                    Id = request.Id,
                    Category = request.Category,
                    Description = request.Description,
                    Assignation = request.Assignation,
                    Deadline = request.Deadline,
                };

                _context.Objectives.Add(objective);
                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Unit.Value;

                throw new Exception ("Problem saving changes");
            }
        }
    }
}