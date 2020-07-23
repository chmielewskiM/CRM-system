using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Objectives
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Category { get; set; }
            public string Description { get; set; }
            public string Assignation { get; set; }
            public DateTime? Deadline { get; set; }
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
                var objective = await _context.Objectives.FindAsync(request.Id);

                if(objective == null)
                    throw new Exception("Could not find objective");

                objective.Category = request.Category ?? objective.Category;
                objective.Description = request.Description ?? objective.Description;
                objective.Assignation = request.Assignation ?? objective.Assignation;
                objective.Deadline = request.Deadline ?? objective.Deadline;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}