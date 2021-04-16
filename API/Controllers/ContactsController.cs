using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Contacts;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Cors;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    // [Produces("application/json")]
    public class ContactsController : BaseController
    {
        ///<summary>
        /// Returns the list with contacts.
        ///</summary>
        ///<response code="200">Returns the list.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<CompleteContactsData>> ListContacts(bool inProcess, bool premium, string orderBy, int? activePage, int? pageSize, string filterInput, bool uncontracted, CancellationToken ct)
        {
            return await Mediator.Send(new ListContacts.Query(inProcess, premium, orderBy, activePage, pageSize, filterInput, uncontracted), ct);
        }

        ///<summary>
        /// Returns the contact by requested name.
        ///</summary>
        ///<response code="200">Returns the contact.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("name/{name}")]
        public async Task<ActionResult<Contact>> GetContact(String name)
        {
            return await Mediator.Send(new GetContact.Query { Name = name });
        }

        ///<summary>
        /// Returns details about the contact.
        ///</summary>
        ///<response code="200">Returns details about the contact.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDTO>> ContactDetails(Guid id)
        {
            return await Mediator.Send(new ContactDetails.Query { Id = id });
        }

        ///<summary>
        /// Adds a contact to the collection.
        ///</summary>
        ///<response code="200">Contact added successfully.</response>
        ///<response code="409">This name is already taken.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult<Unit>> AddContact(AddContact.Command command)
        {
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Edits a contact.
        ///</summary>
        ///<response code="200">Contact edited successfully.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditContact(Guid id, EditContact.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Changes the status of contact's membership.
        ///</summary>
        ///<response code="200">Status changed successfully.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("upgrade/{id}")]
        public async Task<ActionResult<Unit>> UpgradeToPremium(Guid id)
        {
            return await Mediator.Send(new UpgradeToPremium.Command { Id = id });
        }

        ///<summary>
        /// Deletes the contact entirely.
        ///</summary>
        ///<response code="200">Contact deleted successfully.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteContact(Guid id)
        {
            return await Mediator.Send(new DeleteContact.Command { Id = id });
        }

        ///<summary>
        /// When user 'deletes' the contact, in fact he unshares it. The relation between user and
        /// contact is erased, but the contact is kept in the DB.
        ///</summary>
        ///<response code="200">Contact removed successfully.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="424">Some active order is assigned to the contact.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpDelete("remove/{id}")]
        public async Task<ActionResult<Unit>> UnshareContact(Guid id)
        {
            return await Mediator.Send(new UnshareContact.Command { Id = id });
        }
    }
}
