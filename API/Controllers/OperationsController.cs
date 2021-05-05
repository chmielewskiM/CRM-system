using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using Application.Operations;
using Application.Operations.ViewModels;
using Application.Interfaces;
using Application.Operations.Queries;
using Microsoft.AspNetCore.Http;

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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CompleteStatsViewModel))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet]
        public async Task<ActionResult<CompleteStatsViewModel>> ListOperations(CancellationToken ct)
        {
            var listOperationsQuery = new ListOperationsQuery();
            var list = await Mediator.Send(listOperationsQuery);

            return list;
        }

        ///<summary>
        /// Returns count of all operations.
        ///</summary>
        ///<response code="200">Returns operations count.</response>
        ///<response code="500">Server error.</response>
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(int))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("count")]
        public async Task<ActionResult<int>> CountOperations()
        {
            var operationsCount = await _operationsRepository.Count();

            return operationsCount;
        }
    }
}
