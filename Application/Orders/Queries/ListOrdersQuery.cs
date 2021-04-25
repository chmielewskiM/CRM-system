using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Orders.Queries
{
    public class ListOrdersQuery : IRequest<(List<Order>, int)>
    {
        public string AllOrders { get; }
        public string SaleOrders { get; }
        public string ClosedOrders { get; }
        public string OrderBy { get; }
        public string FilterInput { get; }
        public int? PageNumber { get; }
        public int? PageSize { get; }
        
        public ListOrdersQuery(string allOrders, string saleOrders, string closedOrders, string orderBy, string filterInput, int? pageNumber, int? pageSize)
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
}
