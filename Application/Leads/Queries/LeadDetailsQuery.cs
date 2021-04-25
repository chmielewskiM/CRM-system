using System;
using Application.Leads.ViewModels;
using Domain;
using MediatR;

namespace Application.Leads.Queries
{
    public class LeadDetailsQuery : IRequest<Lead>
    {
        public Contact Contact { get; }

        public LeadDetailsQuery(Contact contact)
        {
            Contact = contact;
        }
    }
}
