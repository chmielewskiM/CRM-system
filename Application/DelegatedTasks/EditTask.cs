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
    public class EditTask
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Type { get; set; }
            public DateTime Deadline { get; set; }
            public string Notes { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            // public CommandValidator()
            // {
            //     RuleFor(x => x.Type).NotEmpty();
            //     RuleFor(x => x.Deadline).NotEmpty();
            //     RuleFor(x => x.Notes).NotEmpty();
            // }
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
                    new { message = "Task not found" });

                bool noChanges = (delegatedTask.Type == request.Type &&
                                delegatedTask.Deadline == request.Deadline.AddHours(1) &&
                                delegatedTask.Notes == request.Notes);

                if (noChanges)
                    throw new NoChangesException();

                delegatedTask.Type = request.Type;
                delegatedTask.Deadline = request.Deadline.AddHours(1);
                delegatedTask.Notes = request.Notes;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}