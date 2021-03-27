using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Operations;
using static Application.Operations.List;

namespace API.Controllers
{
    public class OperationController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<CompleteStats>> List( CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }

        // [HttpPost]
        // public async Task<ActionResult<Unit>> Add(Add.Command command)
        // {
        //     return await Mediator.Send(command);
        // }

        // [HttpDelete("{id}")]
        // public async Task<ActionResult<Unit>> DeleteOperation(Guid id)
        // {
        //     return await Mediator.Send(new DeleteOperation.Command { Id = id });
        // }
    }
}
