using System;
using Application.Contacts;
using Application.Orders;
using Application.Orders.ViewModels;

namespace Application.Leads.ViewModels
{
    public class LeadViewModel
    {
        public DateTime LastOperationDate { get; set; }
        public ContactViewModel Contact { get; set; }
        public OrderViewModel Order { get; set; }
    }
}