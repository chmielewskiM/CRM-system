using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using Application.Common;
using Application.Orders.Queries;

namespace Application.Orders.QueryHandlers
{
    public class ListOrdersQueryHandler : IRequestHandler<ListOrdersQuery, (List<Order>, int)>
    {
        private readonly DataContext _context;
        private readonly ILogger<ListOrdersQueryHandler> _logger;

        public ListOrdersQueryHandler(DataContext context, ILogger<ListOrdersQueryHandler> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<(List<Order>, int)> Handle(ListOrdersQuery request, CancellationToken cancellationToken)
        {
            var sortedOrders = await _context.Orders.ToListAsync();

            //select orders by requested category
            if (request.SaleOrders.Equals("true") && request.AllOrders.Equals("false"))
            {
                sortedOrders.RemoveAll(x => x.Type == true);
            }
            else if (request.SaleOrders.Equals("false") && request.AllOrders.Equals("false"))
            {
                sortedOrders.RemoveAll(x => x.Type == false);
            }

            //remove closed or open orders
            if (request.ClosedOrders.Equals("false"))
                sortedOrders.RemoveAll(x => x.Closed == true);
            else sortedOrders.RemoveAll(x => x.Closed == false);

            IQueryable<Order> orders = sortedOrders.AsQueryable();

            //select orders which contain given input
            if (!request.FilterInput.Equals("unfiltered"))
            {
                orders = orders
                .Where(x => x.Client.Name.Contains(request.FilterInput)
                || x.Product.Contains(request.FilterInput)
                || x.Amount.ToString().Contains(request.FilterInput)
                || x.Price.ToString().Contains(request.FilterInput));
            }

            //sort orders in requested way
            switch (request.OrderBy)
            {
                case "name_desc":
                    orders = orders.OrderByDescending(x => x.Client.Name);
                    break;
                case "name_asc":
                    orders = orders.OrderBy(x => x.Client.Name);
                    break;
                case "amount_desc":
                    orders = orders.OrderByDescending(x => x.Amount);
                    break;
                case "amount_asc":
                    orders = orders.OrderBy(x => x.Amount);
                    break;
                case "price_desc":
                    orders = orders.OrderByDescending(x => x.Price);
                    break;
                case "price_asc":
                    orders = orders.OrderBy(x => x.Price);
                    break;
                case "date_desc":
                    if (request.ClosedOrders == "false")
                        orders = orders.OrderByDescending(x => x.DateOrderOpened);
                    else orders = orders.OrderByDescending(x => x.DateOrderClosed);
                    break;
                case "date_asc":
                    if (request.ClosedOrders == "false")
                        orders = orders.OrderBy(x => x.DateOrderOpened);
                    else orders = orders.OrderBy(x => x.DateOrderClosed);
                    break;
            };

            int ordersCount = sortedOrders.Count();

            //convert queryable to list and return the list
            sortedOrders = orders.ToList();

            if (request.ClosedOrders.Equals("true"))
            {
                var paginatedList = PaginatedList<Order>.Create(orders, request.PageNumber ?? 1, request.PageSize ?? 3);

                return (paginatedList, ordersCount);
            }

            return (sortedOrders, ordersCount);
        }
    }
}
