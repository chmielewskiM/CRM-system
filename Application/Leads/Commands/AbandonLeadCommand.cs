using System;
using Domain;
using MediatR;

namespace Application.Leads.Commands
{
    public class AbandonLeadCommand : IRequest
    {
        public string UserId { get; }
        public Contact Lead { get; }
        public bool SaveLead { get; }
        public bool KeepRecords { get; }

        public AbandonLeadCommand(string userId, Contact lead, bool saveLead, bool keepRecords)
        {
            UserId = userId;
            Lead = lead;
            SaveLead = saveLead;
            KeepRecords = keepRecords;
        }
    }
}
