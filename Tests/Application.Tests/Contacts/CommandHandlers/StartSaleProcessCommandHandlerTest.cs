using Application.Contacts.CommandHandlers;
using Application.Contacts.Commands;
using Domain;
using FluentAssertions;
using MediatR;
using Moq;
using System;
using System.Threading;
using Xunit;

namespace Application.Tests.Contacts.CommandHandlers
{
    public class StartSaleProcessCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Starts_Sale_Process()
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
                Status = "Inactive",
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

            OperationsRepository.Setup(x => x.Add(It.IsAny<Operation>(), user)).ReturnsAsync(true).Verifiable();

            Mediator.Setup(x => x.Send(It.IsAny<StartSaleProcessCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var addContactCommand = new StartSaleProcessCommand(contact);

            var handler = new StartSaleProcessCommandHandler(Context, UserAccessor.Object, OperationsRepository.Object);

            var result = await handler.Handle(addContactCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);
            UserAccessor.Verify();
            OperationsRepository.Verify();

            DbContextFactory.Destroy(Context);
        }
    }
}
