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

namespace Application.Orders
{
    public class AddOrder
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public int OrderNumber { get; set; }
            public Guid ClientId { get; set; }
            public Contact Client { get; set; }
            public Boolean Type { get; set; }
            public Boolean Closed { get; set; }
            public string Product { get; set; }
            public Double Amount { get; set; }
            public Double Price { get; set; }
            public DateTime DateOrderOpened { get; set; }
            public DateTime DateOrderClosed { get; set; }
            public string Notes { get; set; }
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
                var client = await _context.Contacts.FindAsync(request.ClientId);
                var orderCount = _context.Orders.Count() + 1;

                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        error = "Could not access user. Make sure you are logged in properly."
                    });

                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    OrderNumber = orderCount,
                    UserId = user.Id,
                    ClientId = request.ClientId,
                    Client = client,
                    Type = request.Type,
                    Closed = request.Closed,
                    Product = request.Product,
                    Amount = request.Amount,
                    Price = request.Price,
                    DateOrderOpened = DateTime.Now,
                    DateOrderClosed = request.DateOrderClosed,
                    Notes = request.Notes,
                };

                _context.Orders.Add(order);

                //add the order to the client
                client.Orders.Append(order);

                //register this operation
                var newOperation = new Operations.Add();

                newOperation.Order++;
                newOperation.Date = order.DateOrderOpened;

                await newOperation.addOperation(newOperation, _context, user);

                await handleSaleProcess(client, order.Id);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
            private async Task handleSaleProcess(Contact client, Guid id)
            {
                //get operations which belong to the currently managed sale process
                IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == client.Id);

                if (saleProcess.Count()>0)
                {
                    saleProcess = saleProcess.OrderByDescending(x => x.Index);
                    //select sale process element with highest index (containing the most recent operation in chain)
                    var lastProcess = await saleProcess.FirstOrDefaultAsync();

                    //check whether there is an order assigned to the current sale process
                    if (lastProcess.OrderId != null)
                        lastProcess.OrderId = id.ToString();
                }
            }
        }
    }
}