using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using Domain;
using Application.Leads.ViewModels;
using Application.Leads.Queries;
using Application.Leads.Commands;
using Application.Contacts.Queries;
using Application.Users.Queries;

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
        ///<response code="200">Returns details about lead.</response>
        ///<response code="404">Lead not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<LeadViewModel>> LeadDetails(Guid id)
        {
            var getContactQuery = new ContactDetailsQuery(id);
            var contact = await Mediator.Send(getContactQuery);

            if (contact == null)
                return NotFound("Lead not found.");

            var leadDetailsQuery = new LeadDetailsQuery(contact);
            var lead = await Mediator.Send(leadDetailsQuery);

            return Mapper.Map<Lead, LeadViewModel>(lead);
        }

        ///<summary>
        /// Adds a lead.
        ///</summary>
        ///<response code="204">Lead added to collection successfully.</response>
        ///<response code="400">This name is already taken.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult> AddLead(Lead lead)
        {
            var getLeadQuery = new GetContactByNameQuery(lead.Contact.Name);

            if (await Mediator.Send(getLeadQuery) != null)
                return BadRequest("This name is already taken.");

            var addLeadCommand = new AddLeadCommand(lead.Contact.Name, lead.Contact.Company, lead.Contact.PhoneNumber, lead.Contact.Email, lead.Contact.Notes, lead.Contact.Source);
            await Mediator.Send(addLeadCommand);

            return NoContent();
        }

        ///<summary>
        /// Changes lead's status.
        ///</summary>
        ///<response code="204">Status changed successfully.</response>
        ///<response code="400">Close order before conversion.</response>
        ///<response code="400">Add an order before upgrading the lead.</response>
        ///<response code="400">Can not downgrade lead whose order was finalized.</response>
        ///<response code="404">Lead not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}={upgrade}")]
        public async Task<ActionResult> ChangeStatus(Guid id, bool upgrade)
        {
            var getContactQuery = new ContactDetailsQuery(id);
            var contact = await Mediator.Send(getContactQuery);
            if (contact == null)
                return NotFound("Lead not found");

            var getLeadQuery = new LeadDetailsQuery(contact);
            var lead = await Mediator.Send(getLeadQuery);

            if (lead.Contact.Status == "Invoice" && !lead.Order.Closed && upgrade)
                return BadRequest("Close the order before conversion.");
            else if (lead.Contact.Status == "Quote" && lead.Order == null && upgrade)
                return BadRequest("Add an order before upgrading lead to 'Invoice'.");
            else if (lead.Contact.Status == "Invoice" && lead.Order != null && lead.Order.Closed && !upgrade)
                return BadRequest("Order has been finalized. You can't downgrade the lead, please convert.");

            var changeStatusCommand = new ChangeStatusCommand(contact, upgrade);
            await Mediator.Send(changeStatusCommand);

            return NoContent();
        }

        ///<summary>
        /// Terminates sale process.
        ///</summary>
        ///<response code="204">Sale process erased successfully.</response>
        ///<response code="400">Delete or close the order before cancelling this process.</response>
        ///<response code="404">No logged user found.</response>
        ///<response code="404">Lead not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpDelete("abandon")]
        public async Task<ActionResult> AbandonLead(Guid id, bool saveLead, bool keepRecords)
        {
            var loggedUserQuery = new LoggedUserQuery();
            User user = await Mediator.Send(loggedUserQuery);

            if (user == null)
                return NotFound("No logged user found.");

            var getLeadQuery = new ContactDetailsQuery(id);
            var lead = await Mediator.Send(getLeadQuery);

            if (lead == null)
                return NotFound("Lead not found.");
            Console.WriteLine(saveLead);
            foreach (var process in lead.CurrentSale)
            {
                if (process.OrderId != null)
                    return BadRequest("Delete or close the order before cancelling this process.");
            }

            var abandonLead = new AbandonLeadCommand(user.Id, lead, saveLead, keepRecords);
            await Mediator.Send(abandonLead);

            return NoContent();
        }
    }
}
