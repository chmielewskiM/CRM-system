using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.DelegatedTasks
{
    public class Add
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Type { get; set; }
            public DateTime DateStarted { get; set; }
            public DateTime Deadline { get; set; }
            public string Notes { get; set; }
            public string FinishedBy { get; set; }
            public Boolean Accepted { get; set; }
            public Boolean Refused { get; set; }

        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.Type).NotEmpty();
                // RuleFor(x => x.Deadline).NotEmpty();
                // RuleFor(x => x.Notes).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var task = new DelegatedTask
                {
                    Id = request.Id,
                    Type = request.Type,
                    Deadline = request.Deadline,
                    Notes = request.Notes,
                    DateStarted = DateTime.Now,
                    Accepted = true,
                    Refused = request.Refused,
                    Pending = false,
                    Done = false,
                    FinishedBy = ""
                };

                _context.DelegatedTasks.Add(task);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetLoggedUsername());

                var userAccess = new UserTask
                {
                    CreatedBy = user,
                    CreatedById = user.Id,
                    SharedWith = null,
                    DelegatedTask = task,
                    DateAdded = request.DateStarted
                };

                _context.UserTasks.Add(userAccess);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}