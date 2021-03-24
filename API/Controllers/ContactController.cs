using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Contacts;
using Domain;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ContactController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<ActionResult<CompleteContactsData>> ListContacts(bool inProcess, bool premium, string orderBy, int? activePage, int? pageSize, string filterInput, bool uncontracted, CancellationToken ct)
        {
            return await _mediator.Send(new ListContacts.Query(inProcess, premium, orderBy, activePage, pageSize, filterInput, uncontracted), ct);
        }
        [HttpGet("name/{name}")]

        public async Task<ActionResult<Contact>> GetContact(String name)
        {
            return await _mediator.Send(new GetContact.Query { Name = name });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDTO>> Details(Guid id)
        {
            return await _mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Add(Add.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await _mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/share")]
        public async Task<ActionResult<Unit>> Share(Guid id)
        {
            return await _mediator.Send(new Share.Command { Id = id });
        }

        [HttpDelete("remove/{id}")]
        public async Task<ActionResult<Unit>> Unshare(Guid id)
        {
            return await _mediator.Send(new Unshare.Command { Id = id });
        }

        [HttpPut("premium/upgrade/{id}")]
        public async Task<ActionResult<Unit>> UpgradeToPremium(Guid id, UpgradeToPremium.Command command)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }
    }
}
