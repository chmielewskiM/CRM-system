using System.Threading;
using Domain;
using System;
using Xunit;
using Moq;
using FluentAssertions;
using Application.Contacts.Commands;
using MediatR;
using Application.Contacts.CommandHandlers;

namespace Application.Tests.Contacts.CommandHandlers
{
    public class AddContactCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Adds_New_Contact_Successfully()
        {
            //Arrange
            var contact = new Contact
            {
                Id = Guid.Empty,
                Name = "Contact",
                Type = "Client",
                Company = "Contact co.",
                PhoneNumber = "000",
                Email = "Contact@",
                Notes = "ABC",
                Source = "Social Media"
            };

            var user = new User
            {
                Id = "1U",
                UserName = "TestUser ",
                DisplayName = "TestUser ",
                Email = "@test",
                Level = "mid"
            };

            UserAccessor.Setup(x => x.GetLoggedUser()).ReturnsAsync(user).Verifiable();
            Mediator.Setup(x => x.Send(It.IsAny<AddContactCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var addContactCommand = new AddContactCommand(contact.Name, contact.Type, contact.Company, contact.PhoneNumber,
                                                    contact.Email, contact.Notes);
            var handler = new AddContactCommandHandler(Context, UserAccessor.Object);
            var result = await handler.Handle(addContactCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);
            UserAccessor.Verify();

            DbContextFactory.Destroy(Context);
        }
    }
}
