using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Operations;

namespace API.Controllers
{
    public class OperationController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<OperationDTO>>> List(CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Add(Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }
    }
}
