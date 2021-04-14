using System;
using System.Collections.Generic;
using Application.Orders;
using Domain;
using Newtonsoft.Json;

namespace Application.Contacts
{
    public class ContactDTO
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
        public Int16 SuccessfulDeals { get; set; }
        public string Source { get; set; }
        public string Premium { get; set; }
        
        [JsonProperty("users")]
        public ICollection<UserAccessDTO> UserContacts { get; set; }
        [JsonProperty("orders")]
        public ICollection<OrderDTO> Orders { get; set; }
    }
}