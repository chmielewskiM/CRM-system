using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using Application.Operations;
using static Application.Operations.ListOperations;

namespace API.Controllers
{
    public class OperationsController : BaseController
    {
        
        [HttpGet]
        public async Task<ActionResult<CompleteStats>> ListOperations( CancellationToken ct)
        {
            return await Mediator.Send(new ListOperations.Query(), ct);
        }

        [HttpGet("count")]
        public async Task<ActionResult<Int32>> CountOperations()
        {
            return await Mediator.Send(new CountOperations.Query());
        }

        // [HttpDelete("{id}")]
        // public async Task<ActionResult<Unit>> DeleteOperation(Guid id)
        // {
        //     return await Mediator.Send(new DeleteOperation.Command { Id = id });
        // }
    }
}
