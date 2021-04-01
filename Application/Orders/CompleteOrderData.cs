using System.Collections.Generic;

namespace Application.Orders
{
    public class CompleteOrderData
    {
        public List<OrderDTO> Orders { get; set; }
        public int OrdersCount { get; set; }

        public CompleteOrderData(List<OrderDTO> orders, int ordersCount)
        {
            Orders = orders;
            OrdersCount = ordersCount;
        }
    }
}