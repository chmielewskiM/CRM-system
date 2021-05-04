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
    public class DeleteContactCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Deletes_Contact_Successfully()
        {
            //Arrange
            var contact = Context.Contacts.First();

            Mediator.Setup(x => x.Send(It.IsAny<DeleteContactCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var deleteContactCommand = new DeleteContactCommand(contact);

            var handler = new DeleteContactCommandHandler(Context);

            var result = await handler.Handle(deleteContactCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);

            DbContextFactory.Destroy(Context);
        }
    }
}
