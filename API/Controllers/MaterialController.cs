using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain;
using System;
using Application.Materials;
using System.Threading;
using Microsoft.AspNetCore.Cors;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [EnableCors]
    public class MaterialController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MaterialController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Material>>> List(CancellationToken ct)
        {
            return await _mediator.Send(new List.Query(), ct);
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
            return await _mediator.Send(new Delete.Command{Id = id});
        }
    }
}