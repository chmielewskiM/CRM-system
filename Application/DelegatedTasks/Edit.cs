using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.DelegatedTasks
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Type { get; set; }
            public DateTime Deadline { get; set; }
            public string Notes { get; set; }
            // public string FinishedBy { get; set; }
            // public Boolean Accepted { get; set; }
            // public Boolean Refused { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Type).NotEmpty();
                RuleFor(x => x.Deadline).NotEmpty();
                RuleFor(x => x.Notes).NotEmpty();
            }
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
                var delegatedTask = await _context.DelegatedTasks.FindAsync(request.Id);

                if (delegatedTask == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { delegatedTask = "Not found" });
                Console.WriteLine(request.Deadline);
                delegatedTask.Type = request.Type ?? delegatedTask.Type;
                delegatedTask.Deadline = request.Deadline.AddHours(1);
                delegatedTask.Notes = request.Notes ?? delegatedTask.Notes;
                // delegatedTask.Accepted = request.Accepted;
                // delegatedTask.Refused = request.Refused;
                // delegatedTask.FinishedBy = request.FinishedBy;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}