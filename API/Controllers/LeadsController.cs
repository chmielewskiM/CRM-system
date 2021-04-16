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
        public async Task<ActionResult<List<LeadDTO>>> ListLeads(bool allLeads, string status, string sortBy, CancellationToken ct)
        {
            return await Mediator.Send(new ListLeads.Query(allLeads, status, sortBy), ct);
        }

        ///<summary>
        /// Returns details about lead.
        ///</summary>
        ///<response code="200">Returns details about leads.</response>
        ///<response code="404">Lead not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<LeadDTO>> LeadDetails(Guid id)
        {
            return await Mediator.Send(new LeadDetails.Query { Id = id });
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
            return await Mediator.Send(new AddLead.Command { Lead = lead });
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
        public async Task<ActionResult<Unit>> ChangeStatus(Guid id, bool upgrade)
        {
            return await Mediator.Send(new ChangeStatus.Command { Id = id, Upgrade = upgrade });
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
        public async Task<ActionResult<Unit>> AbandonLead(Guid id, bool saveContact, bool keepRecords)
        {
            return await Mediator.Send(new AbandonLead.Command(id, saveContact, keepRecords));
        }
    }
}
