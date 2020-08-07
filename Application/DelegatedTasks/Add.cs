using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation;

namespace Application.DelegatedTasks
{
    public class Add
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Assignment { get; set; }
            public string Type { get; set; }
            public DateTime Deadline { get; set; }
            public string Notes { get; set; }
            public Boolean Done { get; set; }

        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Assignment).NotEmpty();
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
                var task = new DelegatedTask
                {
                    Id = request.Id,
                    Assignment = request.Assignment,
                    Type = request.Type,
                    Deadline = request.Deadline,
                    Notes = request.Notes,
                    Done = request.Done
                };

                _context.DelegatedTasks.Add(task);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}