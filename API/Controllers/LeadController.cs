using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Leads;
// using static Application.Leads.AddLead;
using Domain;

namespace API.Controllers
{
    public class LeadController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<LeadDTO>>> ListLeads(bool allLeads, string status, string sortBy, CancellationToken ct)
        {
            return await Mediator.Send(new ListLeads.Query(allLeads, status, sortBy), ct);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LeadDTO>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> AddLead(Lead lead)
        {
            return await Mediator.Send(new AddLead.Command { Lead = lead });
        }

        [HttpPut("/edit/{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Application.Contacts.Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpPut("{id}={upgrade}")]
        public async Task<ActionResult<Unit>> ChangeStatus(Guid id, bool upgrade)
        {
            return await Mediator.Send(new ChangeStatus.Command { Id = id, Upgrade = upgrade });
        }

        [HttpDelete]
        public async Task<ActionResult<Unit>> AbandonLead(Guid id, bool saveContact, bool keepRecords)
        {
            return await Mediator.Send(new AbandonLead.Command(id, saveContact, keepRecords));
        }
    }
}
