using System;
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
namespace Application.Orders
{
    public class ListOrders
    {
        public class Query : IRequest<List<OrderDTO>>
        {
            public string AllOrders { get; set; }
            public string SaleOrders { get; set; }
            public string ClosedOrders { get; set; }
            public string OrderBy { get; set; }
            public string FilterInput { get; set; }
            public int? PageNumber { get; set; }
            public int? PageSize { get; set; }
            public Query(string allOrders, string saleOrders, string closedOrders, string orderBy, string filterInput, int? pageNumber, int? pageSize)
            {
                PageSize = pageSize;
                PageNumber = pageNumber;
                FilterInput = filterInput;
                AllOrders = allOrders;
                SaleOrders = saleOrders;
                ClosedOrders = closedOrders;
                OrderBy = orderBy;
            }
        }
        public class Handler : IRequestHandler<Query, List<OrderDTO>>
        {
            private readonly DataContext _context;
            private readonly ILogger<ListOrders> _logger;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper, ILogger<ListOrders> logger)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<List<OrderDTO>> Handle(Query request, CancellationToken cancellationToken)
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
                //convert queryable to list and return the list
                sortedOrders = orders.ToList();

                if (request.ClosedOrders.Equals("true"))
                {
                    var paginatedList = PaginatedList<Order>.Create(orders, request.PageNumber ?? 1, request.PageSize ?? 3);

                    return _mapper.Map<List<Order>, List<OrderDTO>>(paginatedList);
                }


                return _mapper.Map<List<Order>, List<OrderDTO>>(sortedOrders);
            }
        }
    }
}