using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    // public class DrawNumber
    // {
    //     private readonly int _max;
    //     private readonly int? _min;
    //     public DrawNumber(int max, int? min)
    //     {
    //         _min = min;
    //         _max = max;

    //     }

    //     public void GetRandom(){
    //         Random randomNumber = new Random((int) DateTime.Now.Ticks & 0x0000FFFF);
    //         randomNumber.Next(_max, _min);
    //     }
    // }
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<User> userManager)
        {
            var users = new List<User> { };
            var contacts = new List<Contact> { };
            var delegatedTasks = new List<DelegatedTask> { };
            var calls = new List<Call> { };
            var orders = new List<Order> { };
            var operations = new List<Operation> { };

            Random random = new Random();

            if (!userManager.Users.Any())
            {
                users = new List<User> {
                    new User {
                        DisplayName = "Admin",
                        UserName = "Admin",
                        Email = "admin@sb.com",
                        Level = "top"
                    },
                    new User {
                        DisplayName = "Manager",
                        UserName = "Manager",
                        Email = "manager@sb.com",
                        Level = "mid"
                    },
                    new User {
                        DisplayName = "Manager-2",
                        UserName = "Manager-2",
                        Email = "manager-2@sb.com",
                        Level = "mid"
                    },
                    new User {
                        DisplayName = "Employee",
                        UserName = "Employee",
                        Email = "employee@sb.com",
                        Level = "low"
                    },
                    new User {
                        DisplayName = "Employee-2",
                        UserName = "Employee-2",
                        Email = "employee2@sb.com",
                        Level = "low"
                    }
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Qw123!");
                }

            }

            //CONTACTS

            if (!context.Contacts.Any())
            {
                contacts = new List<Contact> {
                    new Contact {
                        Name = "Michael Storm",
                        Company = "S Solutions",
                        Type = "Lead",
                        PhoneNumber = "111 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-12),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "michael@one.com",
                        Notes = "talk about price",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Evan Whitaker",
                        Company = "ChainQ",
                        Type = "Supplier",
                        PhoneNumber = "222 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-7),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "evan@two.com",
                        Notes = "inform about new purchase",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Evelyn More",
                        Company = "A-Rest",
                        Type = "Client",
                        PhoneNumber = "333 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-7),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "evelyn@three.com",
                        Notes = "report",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Mert Sauer",
                        Company = "VoiceTen",
                        Type = "Lead",
                        PhoneNumber = "444 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-2),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "mert@four.com",
                        Notes = "present the offer",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Vivian Jang",
                        Company = "Mining inc.",
                        Type = "Supplier",
                        PhoneNumber = "555 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-3),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "vivian@five.com",
                        Notes = "",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Sam Ford",
                        Company = "K-Express",
                        Type = "Client",
                        PhoneNumber = "666 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-4),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "sam@six.com",
                        Notes = "",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Robert Guide",
                        Company = "Individual client",
                        Type = "Client",
                        PhoneNumber = "777 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-2),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "robert@seven.com",
                        Notes = "",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Lars Hammer",
                        Company = "Manufacturers inc.",
                        Type = "Lead",
                        PhoneNumber = "888 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-10),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "lars@eight.com",
                        Notes = "",
                        Status = "Inactive"
                    },
                    new Contact {
                        Name = "Larry Graham",
                        Company = "SunTerra",
                        Type = "Lead",
                        PhoneNumber = "999 111 111",
                        DateAdded = DateTime
                            .Now
                            .AddDays(-2),
                        // .ToString("o", CultureInfo.CreateSpecificCulture("en-US")),
                        Email = "larry@nine.com",
                        Notes = "ask about the needs",
                        Status = "Inactive"
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
                orders = new List<Order> {
                    new Order {
                        Client = "Wheeler",
                        Type = false,
                        Product = "Rod S220",
                        Amount = 70,
                        Price = 7000,
                        DateOrderOpened = DateTime
                            .Now
                            .AddDays(-2),
                        Notes = "123"
                    },
                    new Order {
                        Client = "SaIO",
                        Type = false,
                        Product = "Rod S220",
                        Amount = 15,
                        Price = 1200,
                        DateOrderOpened = DateTime
                            .Now
                            .AddDays(-7),
                        Notes = "123"
                    },
                    new Order {
                        Client = "Wrecker",
                        Type = true,
                        Product = "H13",
                        Amount = 110,
                        Price = 8900,
                        DateOrderOpened = DateTime
                            .Now
                            .AddDays(-3),
                        Notes = "123"
                    },
                    new Order {
                        Client = "Mark",
                        Type = false,
                        Product = "Rod S220",
                        Amount = 40,
                        Price = 2400,
                        DateOrderOpened = DateTime
                            .Now
                            .AddDays(-12),
                        Notes = "123"
                    }
                };

                context
                    .Orders
                    .AddRange(orders);
                context.SaveChanges();
            }

            //CALLS
            if (!context.Calls.Any())
            {
                calls = new List<Call> {
                    new Call {
                        Date = DateTime
                            .Now
                            .AddDays(-36),
                        Notes = "1",
                        Accepted = false
                    },
                };

                context
                    .Calls
                    .AddRange(calls);
                context.SaveChanges();
            }

            //TASKS
            if (!context.DelegatedTasks.Any())
            {
                int randomUser;
                var type = new List<String>{
                    "Call", "Manage", "Order", "Send Invoice"
                };
                int randomType;
                int randomDayStart;
                int randomDayEnd;
                int orderNumber = 0;

                var userOperations = new List<UserOperation> { };
                var delegatedTask = new DelegatedTask();

                for (int i = 0; i < 40; i++)
                {
                    randomUser = random.Next(1, 4);
                    randomDayStart = random.Next(12);
                    randomDayEnd = random.Next(8);
                    randomType = random.Next(4);
                    orderNumber++;

                    delegatedTask = new DelegatedTask
                    {
                        Type = type[randomType],
                        DateStarted = DateTime
                            .Now
                            .AddDays(-randomDayStart),
                        Deadline = DateTime
                            .Now
                            .AddDays(-randomDayStart + randomDayEnd),
                        Notes = "",
                        CreatedBy = users[randomUser].DisplayName,
                        Done = false,
                        Accepted = true,
                        Refused = false

                    };

                    delegatedTask.Notes = "#" + orderNumber + "/ " + type[randomType] + " and do it before " + delegatedTask.Deadline.ToLocalTime() + ".";
                    if (i % 5 == 0) { delegatedTask.Accepted = false; delegatedTasks.Add(delegatedTask); continue; }
                    else if (i % 7 == 0) { delegatedTask.Done = true; delegatedTasks.Add(delegatedTask); continue; }
                    else if (i % 13 == 0) { delegatedTask.Accepted = false; delegatedTask.Refused = true; delegatedTasks.Add(delegatedTask); continue; }

                    delegatedTasks.Add(delegatedTask);
                };

                context
                    .DelegatedTasks
                    .AddRange(delegatedTasks);
                context.SaveChanges();
            }

            //OPERATIONS
            if (!context.Operations.Any())
            {
                int randomProperty = 0;
                int randomRevenue = 0;
                int randomDay = 0;
                int randomSource = 0;
                var sources = new List<String>{
                    "Web", "Flyers", "Commercial", "Social media", "Former client"
                };
                var operation = new Operation();

                for (int i = 0; i < 200; i++)
                {
                    randomProperty = random.Next(106);
                    randomRevenue = random.Next(15000);
                    randomDay = random.Next(160);
                    randomSource = random.Next(5);

                    operation = new Operation
                    {
                        Lead = 0,
                        Opportunity = 0,
                        Quote = 0,
                        Invoice = 0,
                        Conversion = 0,
                        Order = 0,
                        Revenue = 0,
                        Source = "",
                        Date = DateTime
                          .Now
                          .AddDays(-randomDay),
                    };

                    if (randomProperty < 40)
                    {
                        operation.Lead = 1;
                        operation.Source = sources[randomSource];
                    }
                    else if (randomProperty >= 40 && randomProperty < 68)
                    {
                        operation.Opportunity = 1;
                    }
                    else if (randomProperty >= 68 && randomProperty < 87)
                    {
                        operation.Quote = 1;
                    }
                    else if (randomProperty >= 87 && randomProperty < 95)
                    {
                        operation.Invoice = 1;
                    }
                    else if (randomProperty >= 95 && randomProperty < 101)
                    {
                        operation.Conversion = 1;
                        operation.Revenue = randomRevenue;
                    }
                    else
                    {
                        operation.Order = 1;
                    }

                    operations.Add(operation);
                };

                context
                    .Operations
                    .AddRange(operations);
                context.SaveChanges();
            }

            //UserOperations
            if (!context.UserOperations.Any())
            {
                int randomUser = 0;
                var userOperations = new List<UserOperation> { };

                for (int i = 0; i < 200; i++)
                {
                    randomUser = random.Next(1, 5);

                    var userOperation = new UserOperation
                    {
                        User = users[randomUser],
                        Operation = operations[i],
                        DateAdded = operations[i].Date
                    };

                    userOperations.Add(userOperation);
                };

                context
                    .UserOperations
                    .AddRange(userOperations);
                context.SaveChanges();
            }

            //UserContacts
            if (!context.UserContacts.Any())
            {
                int randomUser = 0;
                var userContacts = new List<UserContact> { };

                for (int i = 0; i < 9; i++)
                {
                    randomUser = random.Next(1, 4);

                    var userContact = new UserContact
                    {
                        User = users[randomUser],
                        Contact = contacts[i],
                        DateAdded = contacts[i].DateAdded
                    };

                    userContacts.Add(userContact);
                };

                context
                    .UserContacts
                    .AddRange(userContacts);
                context.SaveChanges();
            }

            //UserTasks
            if (!context.UserTasks.Any())
            {
                int randomUser = 0;
                var userTasks = new List<UserTask> { };

                for (int i = 0; i < 40; i++)
                {
                    randomUser = random.Next(1, 5);

                    var userTask = new UserTask
                    {
                        User = users[randomUser],
                        DelegatedTask = delegatedTasks[i],
                        DateAdded = delegatedTasks[i].DateStarted
                    };

                    userTasks.Add(userTask);
                };

                context
                    .UserTasks
                    .AddRange(userTasks);
                context.SaveChanges();
            }
        }
    }
}