using System;
using System.Collections.Generic;
using System.Linq;
using Domain;
namespace Persistence
{
    public class Seed
    {
        public static void SeedData(DataContext context)
        {
            if (!context.Contacts.Any())
            {
                var contacts = new List<Contact> {
                    new Contact {
                        Name = "Michael Storm",
                        Company = "S Solutions",
                        Type = "Lead",
                        PhoneNumber = "111 111 111",
                        DateAdded = DateTime.Now.AddDays(-12),
                        Email = "michael@one.com",
                        Notes = "talk about price",
                    },
                    new Contact {
                        Name = "Evan Whitaker",
                        Company = "ChainQ",
                        Type = "Supplier",
                        PhoneNumber = "222 111 111",
                        DateAdded = DateTime.Now.AddDays(-7),
                        Email = "evan@two.com",
                        Notes = "inform about new purchase",
                    },
                    new Contact {
                        Name = "Evelyn More",
                        Company = "A-Rest",
                        Type = "Client",
                        PhoneNumber = "333 111 111",
                        DateAdded = DateTime.Now.AddDays(-7),
                        Email = "evelyn@three.com",
                        Notes = "report",
                    },
                    new Contact {
                        Name = "Mert Sauer",
                        Company = "VoiceTen",
                        Type = "Lead",
                        PhoneNumber = "444 111 111",
                        DateAdded = DateTime.Now.AddDays(-2),
                        Email = "mert@four.com",
                        Notes = "present the offer",
                    },
                    new Contact {
                        Name = "Vivian Jang",
                        Company = "Mining inc.",
                        Type = "Supplier",
                        PhoneNumber = "555 111 111",
                        DateAdded = DateTime.Now.AddDays(-3),
                        Email = "vivian@five.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Sam Ford",
                        Company = "K-Express",
                        Type = "Client",
                        PhoneNumber = "666 111 111",
                        DateAdded = DateTime.Now.AddDays(-4),
                        Email = "sam@six.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Robert Guide",
                        Company = "Individual client",
                        Type = "Client",
                        PhoneNumber = "777 111 111",
                        DateAdded = DateTime.Now.AddDays(-2),
                        Email = "robert@seven.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Lars Hammer",
                        Company = "Manufacturers inc.",
                        Type = "Lead",
                        PhoneNumber = "888 111 111",
                        DateAdded = DateTime.Now.AddDays(-10),
                        Email = "lars@eight.com",
                        Notes = "",
                    },
                    new Contact {
                        Name = "Larry Graham",
                        Company = "SunTerra",
                        Type = "Lead",
                        PhoneNumber = "999 111 111",
                        DateAdded = DateTime.Now.AddDays(-2),
                        Email = "larry@nine.com",
                        Notes = "ask about the needs",
                    }
                };
                context
                    .Contacts
                    .AddRange(contacts);
                context.SaveChanges();
            }
            if (!context.Objectives.Any())
            {
                var objectives = new List<Objective> {
                    new Objective {
                        Category = "Call lead",
                        Description = "Fresh lead",
                        Assignation = "Robert",
                        Deadline = DateTime
                            .Now
                            .AddDays(2)
                    },
                    new Objective {
                        Category = "Order",
                        Description = "Steel",
                        Assignation = "Justyna",
                        Deadline = DateTime
                            .Now
                            .AddDays(3)
                    },
                    new Objective {
                        Category = "Manage",
                        Description = "Order #43",
                        Assignation = "Robert",
                        Deadline = DateTime
                            .Now
                            .AddDays(2)
                    },
                    new Objective {
                        Category = "Manage",
                        Description = "Manage received supplies",
                        Assignation = "Zenon",
                        Deadline = DateTime
                            .Now
                            .AddDays(1)
                    },
                    new Objective {
                        Category = "Call client",
                        Description = "Mark Dobrow",
                        Assignation = "Francis",
                        Deadline = DateTime
                            .Now
                            .AddDays(1)
                    },
                    new Objective {
                        Category = "Order",
                        Description = "Screws 6x12m",
                        Assignation = "Francis",
                        Deadline = DateTime
                            .Now
                            .AddDays(4)
                    },
                    new Objective {
                        Category = "Call lead",
                        Description = "Hank Whistle",
                        Assignation = "Zenon",
                        Deadline = DateTime
                            .Now
                            .AddDays(6)
                    },
                    new Objective {
                        Category = "Process",
                        Description = "Create 25 parts #89",
                        Assignation = "Stefan",
                        Deadline = DateTime
                            .Now
                            .AddDays(2)
                    }
                };

                context
                    .Objectives
                    .AddRange(objectives);
                context.SaveChanges();
            }
        }
    }
}