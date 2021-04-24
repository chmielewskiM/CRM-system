using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain;
using System;
using Application.Orders;
using System.Threading;
using Application.Orders.ViewModels;
using Application.Orders.Queries;
using Application.Orders.Commands;

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
        ///<response code="204">Returns list with orders.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<CompleteOrderDataViewModel>> ListOrders(string allOrders, string saleOrders, string closedOrders,
                                                                        string orderBy, string filterInput, int? pageNumber, int? pageSize)
        {
            var listOrdersQuery = new ListOrdersQuery(allOrders, saleOrders, closedOrders, orderBy, filterInput, pageNumber, pageSize);
            var data = await Mediator.Send(listOrdersQuery);

            return new CompleteOrderDataViewModel(Mapper.Map<List<Order>, List<OrderViewModel>>(data.Item1), data.Item2);
        }

        ///<summary>
        /// Adds an order.
        ///</summary>
        ///<response code="204">Order added successfully.</response>
        ///<response code="404">Couldn't access the logged user.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult> AddOrder(Order order)
        {
            var addOrderCommand = new AddOrderCommand(order.ClientId, order.Type, order.Product, order.Amount, order.Price, order.Notes);
            await Mediator.Send(addOrderCommand);

            return NoContent();
        }

        ///<summary>
        /// Edits an order.
        ///</summary>
        ///<response code="204">Order updated successfully.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">Couldn't find order or client.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditOrder(Order order)
        {
            var getOrderQuery = new GetOrderQuery(order.Id);
            var getOrder = await Mediator.Send(getOrderQuery);

            if (getOrder == null)
                return BadRequest("Order not found");

            var editOrderCommand = new EditOrderCommand(order.Id, order.Product, order.Amount, order.Price, order.Notes);
            await Mediator.Send(editOrderCommand);

            return NoContent();
        }

        ///<summary>
        /// Closes an order.
        ///</summary>
        ///<response code="204">Order closed successfully.</response>
        ///<response code="404">Order not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("close/{id}")]
        public async Task<ActionResult<Unit>> CloseOrder(Guid id)
        {
            var getOrderQuery = new GetOrderQuery(id);
            var getOrder = await Mediator.Send(getOrderQuery);

            if (getOrder == null)
                return BadRequest("Order not found");

            var closeOrderCommand = new CloseOrderCommand(id);
            await Mediator.Send(closeOrderCommand);

            return NoContent();
        }

        ///<summary>
        /// Deletes an order.
        ///</summary>
        ///<response code="204">Order deleted successfully.</response>
        ///<response code="403">It is forbidden to close an order which is assigned to lead with 'Invoice' status.</response>
        ///<response code="404">Couldn't find logged user.</response>
        ///<response code="409">Order has no client assigned.</response>
        ///<response code="500">Server error.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteOrder(Guid id)
        {
            var orderDetailsQuery = new OrderDetailsQuery(id);
            var order = await Mediator.Send(orderDetailsQuery);

            if (order == null)
                return BadRequest("Order not found");

            var deleteOrderCommand = new DeleteOrderCommand(order.Id);
            await Mediator.Send(deleteOrderCommand);

            return NoContent();
        }
    }
}