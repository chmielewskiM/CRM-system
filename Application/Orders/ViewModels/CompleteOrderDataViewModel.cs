using System.Collections.Generic;

namespace Application.Orders.ViewModels
{
    public class CompleteOrderDataViewModel
    {
        public List<OrderViewModel> Orders { get; set; }
        public int OrdersCount { get; set; }

        public CompleteOrderDataViewModel(List<OrderViewModel> orders, int ordersCount)
        {
            Orders = orders;
            OrdersCount = ordersCount;
        }
    }
}