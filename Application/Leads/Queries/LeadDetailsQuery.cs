using System;
using Domain;
using MediatR;

namespace Application.Leads.Queries
{
    public class LeadDetailsQuery : IRequest<Lead>
    {
        public Contact Contact { get; set; }
        public LeadDetailsQuery(Guid id)
        {
            Contact.Id = id;
        }
    }
}
