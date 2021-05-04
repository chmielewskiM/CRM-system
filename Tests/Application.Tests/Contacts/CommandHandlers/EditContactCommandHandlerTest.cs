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
    public class EditContactCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Edits_Contact_Successfully()
        {
            //Arrange
            var contact = Context.Contacts.First();

            Mediator.Setup(x => x.Send(It.IsAny<EditContactCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var editContactCommand = new EditContactCommand(contact, "name", "type", "company", "123 123 123", "email", "", "" );

            var handler = new EditContactCommandHandler(Context);

            var result = await handler.Handle(editContactCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);

            DbContextFactory.Destroy(Context);
        }
    }
}
