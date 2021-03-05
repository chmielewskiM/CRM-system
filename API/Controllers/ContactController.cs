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
    public class ContactController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<ContactDTO>>> List(CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }
        [HttpGet("name/{name}")]
        
        public async Task<ActionResult<Contact>> GetContact(String name)
        {
            // var n = name.Replace("%20", " ");
            return await Mediator.Send(new GetContact.Query { Name = name });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDTO>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Add(Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/share")]
        public async Task<ActionResult<Unit>> Share(Guid id)
        {
            return await Mediator.Send(new Share.Command { Id = id });
        }

        [HttpPost("{id}/unshare")]
        public async Task<ActionResult<Unit>> Unshare(Guid id)
        {
            return await Mediator.Send(new Unshare.Command { Id = id });
        }
    }
}
