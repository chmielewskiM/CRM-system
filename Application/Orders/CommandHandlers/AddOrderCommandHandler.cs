using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using System.Linq;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Application.Interfaces;
using FluentValidation;

namespace Application.Orders
{
    public class AddOrderCommandHandler : IRequestHandler<AddOrderCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IOperationsRepository _operationsRepository;

        public AddOrderCommandHandler(DataContext context, IUserAccessor userAccessor, IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Unit> Handle(AddOrderCommand request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetLoggedUser();

            int orderNumber = setOrderNumber();

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = orderNumber,
                UserId = user.Id,
                ClientId = request.Client.Id,
                Client = request.Client,
                Type = request.Type,
                Closed = false,
                Product = request.Product,
                Amount = request.Amount,
                Price = request.Price,
                DateOrderOpened = DateTime.Now,
                Notes = request.Notes,
            };
            
            _context.Orders.Add(order);

            //add the order to the client
            request.Client.Orders.Append(order);

            //register this operation
            var operation = new Operation();

            operation.Order = true;
            operation.Date = order.DateOrderOpened;
            await _operationsRepository.Add(operation, user);
            // await operation.addOperation(operation, _context, user);

            //get operations which belong to the currently managed sale process
            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == request.Client.Id);
            //handle the order in case there is a sale process open already
            if (saleProcess.Count() > 0 && order.Type)
                await handleSaleProcess(order.Id, saleProcess);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
        private async Task handleSaleProcess(Guid id, IQueryable<SaleProcess> saleProcess)
        {
            saleProcess = saleProcess.OrderByDescending(x => x.Index);
            //select sale process element with highest index (containing the most recent operation in chain)
            var lastProcess = await saleProcess.FirstOrDefaultAsync();

            //check whether there is an order assigned to the current sale process
            if (lastProcess.OrderId == null)
                foreach (SaleProcess process in saleProcess)
                    process.OrderId = id.ToString();

        }

        //setOrderNumber() finds the correct number for a new order.
        //It solves the issue which happens in case of deleting some order after 
        //an other order was added. For instance we have 5 orders, #1-5 and user deletes #3.
        //setOrderNumber() finds the correct allocation for the new order which would be #3 in that case.
        private int setOrderNumber()
        {
            IQueryable<Order> orders = _context.Orders.OrderBy(x => x.OrderNumber);
            int orderNumber = orders.Count() + 1;
            int lastUnavailable = 0;

            if (orders.Count() > 0)
                foreach (Order o in orders)
                {
                    if (o.OrderNumber - lastUnavailable > 1)
                    {
                        orderNumber = lastUnavailable + 1;
                        return orderNumber;
                    }
                    else lastUnavailable++;
                }

            return orderNumber;
        }
    }
}