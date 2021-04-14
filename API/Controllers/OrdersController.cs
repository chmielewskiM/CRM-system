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
    public class OrdersController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<CompleteOrderData>> ListOrders(string allOrders, string saleOrders, string closedOrders,
                                                                        string orderBy, string filterInput, int? pageNumber, int? pageSize)
        {
            return await Mediator.Send(new ListOrders.Query(allOrders, saleOrders, closedOrders, orderBy, filterInput, pageNumber, pageSize));
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> AddOrder(AddOrder.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditOrder(Guid id)
        {
            return await Mediator.Send(new EditOrder.Command { Id = id });
        }

        [HttpPut("close/{id}")]
        public async Task<ActionResult<Unit>> CloseOrder(Guid id)
        {
            return await Mediator.Send(new CloseOrder.Command { Id = id });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteOrder(Guid id)
        {
            return await Mediator.Send(new DeleteOrder.Command { Id = id });
        }
    }
}