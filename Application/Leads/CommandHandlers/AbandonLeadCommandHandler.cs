using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Leads.Commands;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Leads.CommandHandlers
{
    public class AbandonLeadCommandHandler : IRequestHandler<AbandonLeadCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IOperationsRepository _operationsRepository;

        public AbandonLeadCommandHandler(DataContext context, IUserAccessor userAccessor, IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Unit> Handle(AbandonLeadCommand request, CancellationToken cancellationToken)
        {
            var contact = await _context.Contacts.FindAsync(request.Id);
            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == contact.Id);

            var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetLoggedUsername());

            if (contact == null)
                throw new RestException(HttpStatusCode.NotFound,
                new { message = "Lead not found." });

            bool hasOrder = contact.CurrentSale.Any(x => x.OrderId != null);
            bool hasCompletedOrder = false;

            if (hasOrder)
            {
                string orderId = contact.CurrentSale.First().OrderId;

                hasCompletedOrder = _context.Orders.Any(x => x.Id == new Guid(orderId) && x.Closed.Equals(true));
            }

            if (hasOrder && !hasCompletedOrder)
                throw new RestException(HttpStatusCode.Forbidden,
                new { message = "Delete the order before cancelling this process." });
            else if (hasOrder && hasCompletedOrder)
                throw new RestException(HttpStatusCode.Forbidden,
                new { message = "You can't abandon this process. An order with the lead has been finalized, you have to convert this lead." });

            foreach (SaleProcess process in saleProcess)
            {

                if (!request.KeepRecords)
                {
                    _context.SaleProcess.Remove(process);
                    await _operationsRepository.Delete(process.Operation.Date, new Guid(user.Id));
                }
                else _context.SaleProcess.Remove(process);
            }

            if (request.SaveContact)
                contact.Status = "Inactive";
            else
            {
                var userContact = await _context.UserContacts.FindAsync(new Guid(user.Id), contact.Id);
                _context.UserContacts.Remove(userContact);
                _context.Remove(contact);
            }


            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}