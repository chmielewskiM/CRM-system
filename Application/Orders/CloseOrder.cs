using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders
{
    public class CloseOrder
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public Boolean Closed { get; set; }
            public DateTime DateOrderClosed { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var order = await _context.Orders.FindAsync(request.Id);

                if (order == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { delegatedTask = "Not found" });


                order.Closed = true;

                order.DateOrderClosed = DateTime.Now;



                //add revenue (only sale orders)
                if (order.Type)
                {
                    var newOperation = new Operations.Add();
                    var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                    if (user == null)
                        throw new RestException(HttpStatusCode.NotFound, new
                        {
                            error = "Could not access user. Make sure you are logged in properly."
                        });

                    newOperation.Revenue = order.Price;

                    await newOperation.addOperation(newOperation, _context, user);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}