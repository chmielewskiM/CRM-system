using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Domain;
using Application.Leads.ViewModels;
using Application.Leads.Queries;
using Application.Leads.Commands;
using Application.Contacts.Queries;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    // [Produces("application/json")]
    public class LeadsController : BaseController
    {
        ///<summary>
        /// Returns list with leads.
        ///</summary>
        ///<response code="200">Returns list with leads.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<List<LeadViewModel>>> ListLeads(bool allLeads, string status, string sortBy, CancellationToken ct)
        {
            var listLeadsData = new ListLeadsQuery(allLeads, status, sortBy);
            var list = await Mediator.Send(listLeadsData);

            return Mapper.Map<List<Lead>, List<LeadViewModel>>(list);
        }

        ///<summary>
        /// Returns details about lead.
        ///</summary>
        ///<response code="200">Returns details about leads.</response>
        ///<response code="404">Lead not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<LeadViewModel>> LeadDetails(Guid id)
        {
            var leadDetailsQuery = new LeadDetailsQuery(id);
            var lead = await Mediator.Send(leadDetailsQuery);

            if (lead == null)
                return BadRequest("Lead not found");

            return Mapper.Map<Lead, LeadViewModel>(lead);
        }

        ///<summary>
        /// Adds a lead.
        ///</summary>
        ///<response code="200">Lead added to collection successfully.</response>
        ///<response code="409">This name is already taken.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult<Unit>> AddLead(Lead lead)
        {
            var addLeadCommand = new AddLeadCommand(lead.Contact.Name, lead.Contact.Company, lead.Contact.PhoneNumber, lead.Contact.Email, lead.Contact.Notes, lead.Contact.Source);
            await Mediator.Send(addLeadCommand);

            return NoContent();
        }

        ///<summary>
        /// Changes lead's status.
        ///</summary>
        ///<response code="200">Status changed successfully.</response>
        ///<response code="400">Can't downgrade lead with inactive status.</response>
        ///<response code="403">Lead has an open order assigned to him.</response>
        ///<response code="404">Lead not found.</response>
        ///<response code="409">This name is already taken.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}={upgrade}")]
        public async Task<ActionResult> ChangeStatus(Guid id, bool upgrade)
        {
            var contactDetailsQuery = new ContactDetailsQuery(id);
            var contact = await Mediator.Send(contactDetailsQuery);
            if (contact == null)
                return BadRequest("Lead not found");

            var changeStatusCommand = new ChangeStatusCommand(id, upgrade);
            await Mediator.Send(changeStatusCommand);

            return NoContent();
        }

        ///<summary>
        /// Terminates sale process.
        ///</summary>
        ///<response code="200">Sale process erased successfully.</response>
        ///<response code="403">
        /// It is forbidden to cancel a process while there is an active order assigned to it.
        /// It is forbidden to cancel the process after the assigned order is finalized(closed).
        /// </response>
        ///<response code="404">Lead not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpDelete("abandon")]
        public async Task<ActionResult> AbandonLead(Guid id, bool saveContact, bool keepRecords)
        {
            var abandonLead = new AbandonLeadCommand(id, saveContact, keepRecords);
            await Mediator.Send(abandonLead);

            return NoContent();
        }
    }
}
