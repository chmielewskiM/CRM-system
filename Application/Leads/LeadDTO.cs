using System;
using Application.Contacts;
using Application.Orders;
using Domain;

namespace Application.Leads
{
    public class LeadDTO
    {
        public DateTime LastOperation { get; set; }
        public ContactDTO Contact { get; set; }
        public OrderDTO Order { get; set; }

    }
}