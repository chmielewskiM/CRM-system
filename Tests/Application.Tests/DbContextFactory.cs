using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;

namespace Application.Tests
{
    public static class DbContextFactory
    {
        public static DataContext Create()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new DataContext(options);

            context.Database.EnsureCreated();

            Seed(context);

            return context;
        }

        private static void Seed(DataContext context)
        {
            var user = new User
            {
                Id = "00000000-0000-0000-0000-000000000001",
                UserName = "Test User ",
                DisplayName = "Test User ",
                Email = "@test",
                Level = "mid"
            };
            context.Users.Add(user);

            for (int i = 10; i < 24; i++)
            {
                var contact = new Contact
                {
                    Id = new Guid(i + "000000-0000-0000-0000-000000000000"),
                    Name = "Test Contact " + i,
                    Status = "Inactive",
                    Company = i + " company",
                    Email = i + "@test",
                    DateAdded = DateTime.Now,
                    CurrentSale = new List<SaleProcess>()
                };

                var userContact = new UserContact
                {
                    Id = Guid.NewGuid(),
                    ContactId = contact.Id,
                    UserId = user.Id,
                    Contact = contact,
                    User = user
                };

                if (i % 2 == 0)
                {
                    contact.Status = "Lead";
                    contact.Source = "Web";

                    var saleProcess = new SaleProcess()
                    {
                        Contact = contact,
                        ContactId = new Guid(i + "000000-0000-0000-0000-000000000000"),
                        Operation = new Operation(),
                        OperationId = Guid.NewGuid(),
                        OrderId = null,
                        Index = i,
                    };

                    if (i % 4 == 0)
                    {
                        var order = new Order
                        {
                            Id = Guid.NewGuid(),
                            OrderNumber = context.Orders.CountAsync().Result + 1,
                            Type = true,
                            Product = "Test product",
                            Amount = i * 5,
                            Price = i * 50,
                            DateOrderOpened = DateTime.Now,
                            Client = contact,
                            ClientId = contact.Id,
                            UserId = user.Id,
                        };

                        context.Orders.Add(order);
                    }

                    contact.CurrentSale.Add(saleProcess);
                    context.SaleProcess.Add(saleProcess);
                }

                context.Contacts.Add(contact);
                context.UserContacts.Add(userContact);

            }

            context.SaveChanges();
        }

        public static void Destroy(DataContext context)
        {
            context.Database.EnsureDeleted();
            context.Dispose();
        }
    }
}