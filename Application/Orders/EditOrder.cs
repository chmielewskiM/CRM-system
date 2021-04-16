using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class EditOrder
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public Guid ClientId { get; set; }
            public string Product { get; set; }
            public Double Amount { get; set; }
            public Double Price { get; set; }
            public string Notes { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Price).NotEmpty().OnFailure(x => ValidatorExtensions.brokenRule("Enter the price.")); ;
                RuleFor(x => x.Amount).NotEmpty().OnFailure(x => ValidatorExtensions.brokenRule("Enter the amount.")); ;
                RuleFor(x => x.Product).NotEmpty().OnFailure(x => ValidatorExtensions.brokenRule("Select product.")); ;
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
                //Fluent validation
                CommandValidator validator = new CommandValidator();
                validator.ValidateAndThrow(request);

                var order = await _context.Orders.FindAsync(request.Id);
                var client = await _context.Contacts.FindAsync(order.ClientId);

                if (order == null)
                    throw new RestException(HttpStatusCode.NotFound, new { message = "Could not find order." });
                if (client == null)
                    throw new RestException(HttpStatusCode.NotFound, new { message = "Could not find client." });

                bool noChanges = (order.Amount == request.Amount &&
                order.Notes == request.Notes &&
                order.Price == request.Price &&
                order.Product == request.Product);

                if (noChanges)
                    throw new NoChangesException();

                order.Amount = request.Amount;
                order.Notes = request.Notes;
                order.Price = request.Price;
                order.Product = request.Product;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}