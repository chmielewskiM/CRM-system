using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain;
using System;
using Application.Orders;
using Application.Orders.ViewModels;
using Application.Orders.Queries;
using Application.Orders.Commands;
using Application.Contacts.Queries;
using Application.Users.Queries;
using FluentValidation.AspNetCore;

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
        ///<response code="404">Client not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult> AddOrder([CustomizeValidator(Interceptor=typeof(API.Middleware.ValidatorInterceptor))]OrderViewModel order)
        {
            var loggedUserQuery = new LoggedUserQuery();
            User user = await Mediator.Send(loggedUserQuery);

            var getClientQuery = new GetContactByNameQuery(order.ClientName);
            var client = await Mediator.Send(getClientQuery);

            if (client == null)
                return NotFound("Client not found.");

            var addOrderCommand = new AddOrderCommand(client, order.Type, order.Product, order.Amount, order.Price, order.Notes);
            await Mediator.Send(addOrderCommand);

            return NoContent();
        }

        ///<summary>
        /// Edits an order.
        ///</summary>
        ///<response code="204">Order updated successfully.</response>
        ///<response code="404">Order not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}")]
        public async Task<ActionResult> EditOrder([CustomizeValidator(Interceptor=typeof(API.Middleware.ValidatorInterceptor))]OrderViewModel order)
        {
            var getOrderQuery = new GetOrderQuery(order.Id);
            var orderQuery = await Mediator.Send(getOrderQuery);

            if (orderQuery == null)
                return NotFound("Order not found");

            var editOrderCommand = new EditOrderCommand(orderQuery, order.Product, order.Amount, order.Price, order.Notes);
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
            var loggedUserQuery = new LoggedUserQuery();
            User user = await Mediator.Send(loggedUserQuery);

            var getOrderQuery = new GetOrderQuery(id);
            var order = await Mediator.Send(getOrderQuery);

            if (order == null)
                return NotFound("Order not found");

            var closeOrderCommand = new CloseOrderCommand(order);
            await Mediator.Send(closeOrderCommand);

            return NoContent();
        }

        ///<summary>
        /// Deletes an order.
        ///</summary>
        ///<response code="204">Order deleted successfully.</response>
        ///<response code="400">Can not delete an order which is assigned to lead with 'Invoice' status.</response>
        ///<response code="404">Order not found.</response>
        ///<response code="404">Client assigned to order not found.</response>
        ///<response code="500">Server error.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(Guid id)
        {
            var getOrderQuery = new GetOrderQuery(id);
            var order = await Mediator.Send(getOrderQuery);

            if (order == null)
                return NotFound("Order not found");

            Guid clientId = order.ClientId ?? new Guid();
            var getClientQuery = new ContactDetailsQuery(clientId);
            var client = await Mediator.Send(getClientQuery);

            if (client == null)
                return NotFound("There is no client assigned to the order.");

            if (client.Status == "Invoice")
                return BadRequest("You can't delete an order which is waiting for finalization. Downgrade client's status first.");

            var deleteOrderCommand = new DeleteOrderCommand(client, order);
            await Mediator.Send(deleteOrderCommand);

            return NoContent();
        }
    }
}