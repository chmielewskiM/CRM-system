using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using Application.Operations;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    // [Produces("application/json")]
    public class OperationsController : BaseController
    {
        ///<summary>
        /// Returns all operations.
        ///</summary>
        ///<response code="200">Returns all operations.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<CompleteStats>> ListOperations(CancellationToken ct)
        {
            return await Mediator.Send(new ListOperations.Query(), ct);
        }

        ///<summary>
        /// Returns count of all operations.
        ///</summary>
        ///<response code="200">Returns count.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpGet("count")]
        public async Task<ActionResult<Int32>> CountOperations()
        {
            return await Mediator.Send(new CountOperations.Query());
        }
    }
}
