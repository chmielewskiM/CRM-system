using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Orders.Queries
{
    public class ListOrdersQuery : IRequest<(List<Order>, int)>
    {
        public string AllOrders { get; set; }
        public string SaleOrders { get; set; }
        public string ClosedOrders { get; set; }
        public string OrderBy { get; set; }
        public string FilterInput { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
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
