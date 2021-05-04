using System.Threading;
using System.Linq;
using Xunit;
using Moq;
using Application.Tests;
using FluentAssertions;
using Application.Orders.Commands;
using MediatR;

namespace Application.Orders.CommandHandlers
{
    public class EditOrderCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Edits_New_Order_Successfully()
        {
            //Arrange
            var order = Context.Orders.FirstOrDefault();

            Mediator.Setup(x => x.Send(It.IsAny<EditOrderCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var editOrderCommand = new EditOrderCommand(order, "test product", 20, 50.5, "");

            var handler = new EditOrderCommandHandler(Context);

            var result = await handler.Handle(editOrderCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);

            DbContextFactory.Destroy(Context);
        }
    }
}
