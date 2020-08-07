using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Domain;
namespace Persistence
{
    public class Seed
    {
        public static void SeedData(DataContext context)
        {
            //CONTACTS
            if (!context.Contacts.Any())
            {
                var contacts = new List<Contact> {
                    new Contact {
                        Name = "Michael Storm",
                        Company = "S Solutions",
                        Type = "Lead",
                        PhoneNumber = "111 111 111",
                        DateAdded = DateTime.Now.AddDays(-12),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "michael@one.com",
                        Notes = "talk about price",
                    },
                    new Contact {
                        Name = "Evan Whitaker",
                        Company = "ChainQ",
                        Type = "Supplier",
                        PhoneNumber = "222 111 111",
                        DateAdded = DateTime.Now.AddDays(-7),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "evan@two.com",
                        Notes = "inform about new purchase",
                    },
                    new Contact {
                        Name = "Evelyn More",
                        Company = "A-Rest",
                        Type = "Client",
                        PhoneNumber = "333 111 111",
                        DateAdded = DateTime.Now.AddDays(-7),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "evelyn@three.com",
                        Notes = "report",
                    },
                    new Contact {
                        Name = "Mert Sauer",
                        Company = "VoiceTen",
                        Type = "Lead",
                        PhoneNumber = "444 111 111",
                        DateAdded = DateTime.Now.AddDays(-2),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "mert@four.com",
                        Notes = "present the offer",
                    },
                    new Contact {
                        Name = "Vivian Jang",
                        Company = "Mining inc.",
                        Type = "Supplier",
                        PhoneNumber = "555 111 111",
                        DateAdded = DateTime.Now.AddDays(-3),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "vivian@five.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Sam Ford",
                        Company = "K-Express",
                        Type = "Client",
                        PhoneNumber = "666 111 111",
                        DateAdded = DateTime.Now.AddDays(-4),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "sam@six.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Robert Guide",
                        Company = "Individual client",
                        Type = "Client",
                        PhoneNumber = "777 111 111",
                        DateAdded = DateTime.Now.AddDays(-2),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "robert@seven.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Lars Hammer",
                        Company = "Manufacturers inc.",
                        Type = "Lead",
                        PhoneNumber = "888 111 111",
                        DateAdded = DateTime.Now.AddDays(-10),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "lars@eight.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Larry Graham",
                        Company = "SunTerra",
                        Type = "Lead",
                        PhoneNumber = "999 111 111",
                        DateAdded = DateTime.Now.AddDays(-2),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "larry@nine.com",
                        Notes = "ask about the needs",
                    }
                };
                context
                    .Contacts
                    .AddRange(contacts);
                context.SaveChanges();
            }
            // ORDERS
            if (!context.Orders.Any())
            {
                var orders = new List<Order> {
                    new Order {
                        Client = "Call lead",
                        Product = "Rod S220",
                        Amount = 2,
                        Price = 760,
                        DateOrderOpened = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Deadline = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        DateOrderClosed = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Notes = "123"

                    },
                    new Order {
                        Client = "Call lead",
                        Product = "Rod S220",
                        Amount = 5,
                        Price = 1500,
                        DateOrderOpened = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Deadline = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        DateOrderClosed = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Notes = "123"

                    },
                    new Order {
                        Client = "Call lead",
                        Product = "Rod SE60",
                        Amount = 80,
                        Price = 9200,
                        DateOrderOpened = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Deadline = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        DateOrderClosed = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Notes = "123"

                    },
                    new Order {
                        Client = "Call lead",
                        Product = "Rod S9E",
                        Amount = 150,
                        Price = 12800,
                        DateOrderOpened = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Deadline = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        DateOrderClosed = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Notes = "123"

                    },
                };

                context
                    .Orders
                    .AddRange(orders);
                context.SaveChanges();
            }
            //CALLS
            if (!context.Calls.Any())
            {
                var calls = new List<Call> {
                    new Call {
                        // Name = Contact,
                        DateCalled = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Notes = "1"
                    },
                    new Call {
                        // Name = Contact,
                        DateCalled = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Notes = "2"
                    },
                    new Call {
                        // Name = Contact,
                        DateCalled = DateTime.Now.AddDays(-2)
                        .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Notes = "3"
                    },

                };

                context
                    .Calls
                    .AddRange(calls);
                context.SaveChanges();
            }
            //STOCK
            if (!context.Materials.Any())
            {
                var materials = new List<Material> {
                    new Material {
                        Name = "2H13",
                        Storehouse = "Minneapolis #1",
                        Available = 3000,
                        Deployed = 380,
                        Ordered = 0,
                        Required = 0
                    },
                    new Material {
                        Name = "H25T",
                        Storehouse = "Rochester #2",
                        Available = 8950,
                        Deployed = 0,
                        Ordered = 0,
                        Required = 0
                    },
                    new Material {
                        Name = "0H18N9",
                        Storehouse = "Minneapolis #1",
                        Available = 0,
                        Deployed = 2000,
                        Ordered = 500,
                        Required = 1800
                    },
                    new Material {
                        Name = "H17",
                        Storehouse = "Rochester #2",
                        Available = 12000,
                        Deployed = 3600,
                        Ordered = 0,
                        Required = 0
                    },
                    new Material {
                        Name = "2H13",
                        Storehouse = "Rochester #3",
                        Available = 500,
                        Deployed = 1200,
                        Ordered = 1000,
                        Required = 2000
                    },

                };

                context
                    .Materials
                    .AddRange(materials);
                context.SaveChanges();
            }
            //TASKS
            if (!context.DelegatedTasks.Any())
            {
                var delegatedTasks = new List<DelegatedTask> {
                    new DelegatedTask {
                        Assignment = "Employee#1",
                        Type = "Send invoice",
                        Deadline = DateTime.Now.AddDays(5),
                        Notes = "Order #556788",
                        Done = false
                    },
                    new DelegatedTask {
                        Assignment = "Manager#2",
                        Type = "Order",
                        Deadline = DateTime.Now.AddDays(3),
                        Notes = "Order #588",
                        Done = false
                    },
                    new DelegatedTask {
                        Assignment = "Employee#5",
                        Type = "Call",
                        Deadline = DateTime.Now.AddDays(2),
                        Notes = "Offer",
                        Done = false
                    },
                    new DelegatedTask {
                        Assignment = "Employee#2",
                        Type = "Order",
                        Deadline = DateTime.Now.AddDays(7),
                        Notes = "2HS44",
                        Done = false
                    },
                    new DelegatedTask {
                        Assignment = "Manager#1",
                        Type = "Call",
                        Deadline = DateTime.Now.AddDays(1),
                        Notes = "Lead",
                        Done = false
                    },
                };

                context
                    .DelegatedTasks
                    .AddRange(delegatedTasks);
                context.SaveChanges();
            }
        }
    }
}