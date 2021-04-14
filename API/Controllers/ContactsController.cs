using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Contacts;
using Domain;
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{
    [Produces("application/json")]
    public class ContactsController : BaseController
    {
        /// <summary>
        /// Returns the list
        /// </summary>
        ///<response code="200">Returns the list</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CompleteContactsData>> ListContacts(bool inProcess, bool premium, string orderBy, int? activePage, int? pageSize, string filterInput, bool uncontracted, CancellationToken ct)
        {
            return await Mediator.Send(new ListContacts.Query(inProcess, premium, orderBy, activePage, pageSize, filterInput, uncontracted), ct);
        }

        /// <summary>
        /// Returns the list
        /// </summary>
        ///<response code="200">Returns the list</response>
        ///<response code="306">Contact not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{name}")]
        public async Task<ActionResult<Contact>> GetContact(String name)
        {
            return await Mediator.Send(new GetContact.Query { Name = name });
        }

        /// <summary>
        /// Return the contact's details
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDTO>> ContactDetails(Guid id)
        {
            return await Mediator.Send(new ContactDetails.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> AddContact(AddContact.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditContact(Guid id)
        {
            return await Mediator.Send(new EditContact.Command { Id = id });
        }

        [HttpPut("upgrade/{id}")]
        public async Task<ActionResult<Unit>> UpgradeToPremium(Guid id)
        {
            return await Mediator.Send(new UpgradeToPremium.Command { Id = id });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteContact(Guid id)
        {
            return await Mediator.Send(new DeleteContact.Command { Id = id });
        }

        [HttpDelete("remove/{id}")]
        public async Task<ActionResult<Unit>> UnshareContact(Guid id)
        {
            return await Mediator.Send(new UnshareContact.Command { Id = id });
        }
    }
}
