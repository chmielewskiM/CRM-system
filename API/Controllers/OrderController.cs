using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain;
using System;
using Application.Orders;
using System.Threading;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OrderController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> ListOrders(string allOrders, string saleOrders, string closedOrders, 
                                                                        string orderBy, string filterInput, int? pageNumber, int? pageSize)
        {
            return await _mediator.Send(new ListOrders.Query(allOrders, saleOrders, closedOrders, orderBy, filterInput, pageNumber, pageSize));
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
        [HttpPut("close/{id}")]
        public async Task<ActionResult<Unit>> CloseOrder(Guid id, CloseOrder.Command command)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await _mediator.Send(new Delete.Command { Id = id });
        }
    }
}