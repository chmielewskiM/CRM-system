using System;
using Domain;
using MediatR;

namespace Application.Leads.Commands
{
    public class AbandonLeadCommand : IRequest
    {
        public Guid Id { get; set; }
        public bool SaveContact { get; set; }
        public bool KeepRecords { get; set; }
        public AbandonLeadCommand(Guid id, bool saveContact, bool keepRecords)
        {
            KeepRecords = keepRecords;
            SaveContact = saveContact;
            Id = id;
        }
    }
}
