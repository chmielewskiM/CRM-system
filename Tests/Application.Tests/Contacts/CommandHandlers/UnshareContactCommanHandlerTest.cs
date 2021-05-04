using System.Threading;
using System.Linq;
using Xunit;
using Moq;
using Application.Tests;
using FluentAssertions;
using Application.Contacts.Commands;
using MediatR;

namespace Application.Contacts.CommandHandlers
{
    public class UnshareContactCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Unshares_Contact_Successfully()
        {
            //Arrange
            var contact = Context.Contacts.First();
            var userContact = Context.UserContacts.Where(x => x.ContactId == contact.Id).FirstOrDefault();
            var user = Context.Users.Where(x => x.Id == userContact.UserId).FirstOrDefault();

            Mediator.Setup(x => x.Send(It.IsAny<UnshareContactCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var unshareContactCommand = new UnshareContactCommand(contact.Id, user.Id);

            var handler = new UnshareContactCommandHandler(Context);

            var result = await handler.Handle(unshareContactCommand, new CancellationToken());
            
            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);

            DbContextFactory.Destroy(Context);
        }
    }
}
