using System.Threading;
using System.Linq;
using Xunit;
using Moq;
using FluentAssertions;
using Application.Contacts.Commands;
using MediatR;
using Application.Contacts.CommandHandlers;

namespace Application.Tests.Contacts.CommandHandlers
{
    public class UpgradeToPremiumCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Upgrades_Contact_To_Premium_Member()
        {
            //Arrange
            var contact = Context.Contacts.First();
            Mediator.Setup(x => x.Send(It.IsAny<UpgradeToPremiumCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var upgradeToPremiumCommand = new UpgradeToPremiumCommand(contact.Id);
            var handler = new UpgradeToPremiumCommandHandler(Context);
            var result = await handler.Handle(upgradeToPremiumCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);

            DbContextFactory.Destroy(Context);
        }
    }
}
