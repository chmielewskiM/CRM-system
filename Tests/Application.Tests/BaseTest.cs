using API;
using Application.Users.ViewModels;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace Application.Tests
{
    public class BaseTest
    {
        protected Mock<IMediator> _mediator;
        protected Mock<IMediator> Mediator => _mediator ?? (_mediator = new Mock<IMediator>());

        protected DataContext Context = new DataContext(new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "System Test")
                .Options);

        protected async Task seedInMemoryDb()
        {
            var user = new User
            {
                Id = "1u",
                UserName = "Test User ",
                DisplayName = "Test User ",
                Email = "@test",
                Level = "mid"
            };
            for (int i = 0; i < 10; i++)
            {
                string status = "Inactive";
                if (i % 2 == 0) status = "Lead";

                var contact = new Contact
                {
                    Id = Guid.NewGuid(),
                    Name = "Test Contact " + i,
                    Status = status,
                    Company = i + " company",
                    Email = i + "@test",
                    DateAdded = DateTime.Now,
                };

                var userContact = new UserContact
                {
                    Id = Guid.NewGuid(),
                    ContactId = contact.Id,
                    UserId = user.Id,
                    Contact = contact,
                    User = user
                };

                await Context.Contacts.AddAsync(contact);
                
                await Context.UserContacts.AddAsync(userContact);
            }
            await Context.Users.AddAsync(user);
        }

        protected void disposeDb()
        {
            Context.Dispose();
        }
    }
}
