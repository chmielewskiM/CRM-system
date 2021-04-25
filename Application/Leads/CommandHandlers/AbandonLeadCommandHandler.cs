using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Leads.Commands;
using Domain;
using MediatR;
using Persistence;

namespace Application.Leads.CommandHandlers
{
    public class AbandonLeadCommandHandler : IRequestHandler<AbandonLeadCommand>
    {
        private readonly DataContext _context;
        private readonly IOperationsRepository _operationsRepository;

        public AbandonLeadCommandHandler(DataContext context, IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
            _context = context;
        }

        public async Task<Unit> Handle(AbandonLeadCommand request, CancellationToken cancellationToken)
        {

            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == request.Lead.Id);

            foreach (SaleProcess process in saleProcess)
            {
                _context.SaleProcess.Remove(process);

                if (!request.KeepRecords)
                    await _operationsRepository.Delete(process.Operation.Date, request.UserId);
            }
            Console.WriteLine(request.SaveLead);
            if (request.SaveLead)
                request.Lead.Status = "Inactive";
            else
            {
                var userContact = await _context.UserContacts.FindAsync(request.UserId, request.Lead.Id);
                if (userContact != null)
                    _context.UserContacts.Remove(userContact);
                _context.Remove(request.Lead);
            }

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}