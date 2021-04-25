using System;
using System.Collections.Generic;
using Application.Contacts.ViewModels;
using Application.Orders;
using Application.Orders.ViewModels;
using Newtonsoft.Json;

namespace Application.Contacts
{
    public class ContactViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Company { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public DateTime DateAdded { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
        public int SuccessfulDeals { get; set; }
        public string Source { get; set; }
        public Boolean Premium { get; set; }
        
        [JsonProperty("users")]
        public ICollection<UserAccessViewModel> UserContacts { get; set; }
        [JsonProperty("orders")]
        public ICollection<OrderViewModel> Orders { get; set; }
    }
}