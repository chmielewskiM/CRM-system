using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using Application.Operations;
using Application.Operations.ViewModels;
using Application.Interfaces;
using Application.Operations.Queries;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    // [Produces("application/json")]
    public class OperationsController : BaseController
    {
        private readonly IOperationsRepository _operationsRepository;
        public OperationsController(IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
        }
        ///<summary>
        /// Returns all operations.
        ///</summary>
        ///<response code="200">Returns all operations.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<CompleteStatsViewModel>> ListOperations(CancellationToken ct)
        {
            var listOperationsQuery = new ListOperationsQuery();
            var list = await Mediator.Send(listOperationsQuery);

            // if (list == null)
            //     return BadRequest("Contact not found");

            return list;
        }

        ///<summary>
        /// Returns count of all operations.
        ///</summary>
        ///<response code="200">Returns count.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpGet("count")]
        public async Task<ActionResult<int>> CountOperations()
        {
            var operationsCount = await _operationsRepository.Count();

            return operationsCount;
        }
    }
}
