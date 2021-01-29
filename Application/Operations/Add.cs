using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Operations
{
    public class Add
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public Int64 Lead { get; set; }
            public Int64 Opportunity { get; set; }
            public Int64 Converted { get; set; }
            public Int64 Order { get; set; }
            public Double Revenue { get; set; }
            public string Source { get; set; }
            public DateTime Date { get; set; }


        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.Name).NotEmpty();
                // RuleFor(x => x.Type).NotEmpty();
                // RuleFor(x => x.Company).NotEmpty();
                // RuleFor(x => x.PhoneNumber).NotEmpty();
                // RuleFor(x => x.Email).NotEmpty();
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
                var operation = new Domain.Operation
                {
                    Id = request.Id,
                    Lead = request.Lead,
                    Opportunity = request.Opportunity,
                    Converted = request.Converted,
                    Order = request.Order,
                    Revenue = request.Revenue,
                    Source = request.Source,
                    Date = request.Date
                };

                _context.Operations.Add(operation);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetLoggedUsername());

                var userAccess = new UserOperation
                {
                    User = user,
                    Operation = operation,
                    DateAdded = request.Date
                };

                _context.UserOperations.Add(userAccess);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}