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
    // [Produces("application/json")]
    public class OrdersController : BaseController
    {
        ///<summary>
        /// Returns list with orders.
        ///</summary>
        ///<response code="200">Returns list with orders.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<CompleteOrderData>> ListOrders(string allOrders, string saleOrders, string closedOrders,
                                                                        string orderBy, string filterInput, int? pageNumber, int? pageSize)
        {
            return await Mediator.Send(new ListOrders.Query(allOrders, saleOrders, closedOrders, orderBy, filterInput, pageNumber, pageSize));
        }

        ///<summary>
        /// Adds an order.
        ///</summary>
        ///<response code="200">Order added successfully.</response>
        ///<response code="404">Couldn't access the logged user.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult<Unit>> AddOrder(AddOrder.Command command)
        {
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Edits an order.
        ///</summary>
        ///<response code="200">Order updated successfully.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">Couldn't find order or client.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditOrder(Guid id, EditOrder.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Closes an order.
        ///</summary>
        ///<response code="200">Order closed successfully.</response>
        ///<response code="404">Couldn't find order or failed to get logged user.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("close/{id}")]
        public async Task<ActionResult<Unit>> CloseOrder(Guid id)
        {
            return await Mediator.Send(new CloseOrder.Command { Id = id });
        }

        ///<summary>
        /// Deletes an order.
        ///</summary>
        ///<response code="200">Order deleted successfully.</response>
        ///<response code="403">It is forbidden to close an order which is assigned to lead with 'Invoice' status.</response>
        ///<response code="404">Couldn't find logged user.</response>
        ///<response code="409">Order has no client assigned.</response>
        ///<response code="500">Server error.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteOrder(Guid id)
        {
            return await Mediator.Send(new DeleteOrder.Command { Id = id });
        }
    }
}