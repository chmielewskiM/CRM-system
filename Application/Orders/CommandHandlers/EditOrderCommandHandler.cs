using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Orders.Commands;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class EditOrderCommandHandler : IRequestHandler<EditOrderCommand>
    {
        private readonly DataContext _context;

        public EditOrderCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(EditOrderCommand request, CancellationToken cancellationToken)
        {
            request.Order.Amount = request.Amount;
            request.Order.Notes = request.Notes;
            request.Order.Price = request.Price;
            request.Order.Product = request.Product;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}
