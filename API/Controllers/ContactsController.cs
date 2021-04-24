using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Contacts;
using Domain;
using Application.Contacts.Queries;
using Application.Contacts.Commands;
using Application.Validators;
using System.Collections.Generic;

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
        public async Task<ActionResult<CompleteContactsDataViewModel>> ListContacts(bool inProcess, bool premium, string orderBy, int? activePage, int? pageSize, string filterInput, bool uncontracted, CancellationToken ct)
        {
            var completeContactsData = new ListContactsQuery(inProcess, premium, orderBy, activePage, pageSize, filterInput, uncontracted);
            var data = await Mediator.Send(completeContactsData);

            return new CompleteContactsDataViewModel(Mapper.Map<List<Contact>, List<ContactViewModel>>(data.Item1), data.Item2);
        }

        ///<summary>
        /// Returns the contact by requested name.
        ///</summary>
        ///<response code="200">Returns the contact.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("name/{name}")]
        public async Task<ActionResult<ContactViewModel>> GetContact(String name)
        {

            var getContactByNameQuery = new GetContactByNameQuery(name);
            var contact = await Mediator.Send(getContactByNameQuery);

            if (contact == null)
                return BadRequest("Contact not found");

            return Mapper.Map<Contact, ContactViewModel>(contact);
        }

        ///<summary>
        /// Returns details about the contact.
        ///</summary>
        ///<response code="200">Returns details about the contact.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactViewModel>> ContactDetails(Guid id)
        {
            var contactDetailsQuery = new ContactDetailsQuery(id);
            var contact = await Mediator.Send(contactDetailsQuery);

            if (contact == null)
                return BadRequest("Contact not found");

            return Mapper.Map<Contact, ContactViewModel>(contact);
        }

        ///<summary>
        /// Adds a contact to the collection.
        ///</summary>
        ///<response code="200">Contact added successfully.</response>
        ///<response code="409">This name is already taken.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult> AddContact(ContactViewModel contact)
        {
            var contactExists = GetContact(contact.Name).IsCompletedSuccessfully;
            if (contactExists)
                return BadRequest("Contact exists already.");

            var addContactCommand = new AddContactCommand(contact.Id, contact.Name, contact.Type, contact.Company, contact.PhoneNumber, contact.Email, contact.Notes);
            await Mediator.Send(addContactCommand);

            return NoContent();
        }

        ///<summary>
        /// Edits a contact.
        ///</summary>
        ///<response code="200">Contact edited successfully.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("{id}")]
        public async Task<ActionResult> StartSaleProcess(Guid id)
        {
            var contactDetailsQuery = new ContactDetailsQuery(id);
            var notFound = await Mediator.Send(contactDetailsQuery) == null;

            if (notFound)
                return BadRequest("Contact not found");

            var startSaleProcessCommand = new StartSaleProcessCommand(id);
            await Mediator.Send(startSaleProcessCommand);

            return NoContent();
        }

        ///<summary>
        /// Changes the status of contact's membership.
        ///</summary>
        ///<response code="200">Status changed successfully.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("upgrade/{id}")]
        public async Task<ActionResult> UpgradeToPremium(Guid id)
        {
            var contactDetailsQuery = new ContactDetailsQuery(id);
            var contact = await Mediator.Send(contactDetailsQuery);

            if (contact == null)
                return BadRequest("Contact not found");

            var upgradeToPremiumCommand = new UpgradeToPremiumCommand(contact.Id);
            await Mediator.Send(upgradeToPremiumCommand);

            return NoContent();
        }

        ///<summary>
        /// Edits a contact.
        ///</summary>
        ///<response code="200">Contact edited successfully.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}")]
        public async Task<ActionResult> EditContact(Contact contact)
        {
            var contactDetailsQuery = new ContactDetailsQuery(contact.Id);
            var notFound = await Mediator.Send(contactDetailsQuery) == null;

            if (notFound)
                return BadRequest("Contact not found");

            var editContactCommand = new EditContactCommand(contact.Id, contact.Name, contact.Type, contact.Company, contact.PhoneNumber, contact.Email, contact.Notes, contact.Source);
            await Mediator.Send(editContactCommand);

            return NoContent();
        }

        ///<summary>
        /// Deletes the contact entirely.
        ///</summary>
        ///<response code="200">Contact deleted successfully.</response>
        ///<response code="404">Contact not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContact(Guid id)
        {
            var contactDetailsQuery = new ContactDetailsQuery(id);
            var contact = await Mediator.Send(contactDetailsQuery);

            if (contact == null)
                return BadRequest("Contact not found");

            var deleteContactCommand = new DeleteContactCommand(contact.Id);
            await Mediator.Send(deleteContactCommand);

            return NoContent();
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
        public async Task<ActionResult> UnshareContact(Guid id)
        {
            var contactDetailsQuery = new ContactDetailsQuery(id);
            var contact = await Mediator.Send(contactDetailsQuery);

            if (contact == null)
                return BadRequest("Contact not found");

            var unshareContactCommand = new UnshareContactCommand(id);
            await Mediator.Send(unshareContactCommand);

            return NoContent();
        }
    }
}
