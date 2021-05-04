using System.Threading;
using System.Linq;
using Xunit;
using Moq;
using Application.Tests;
using FluentAssertions;
using Application.Orders.Commands;
using MediatR;
using System;

namespace Application.Orders.CommandHandlers
{
    public class DeleteOrderCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Deletes_Order_Successfully()
        {
            //Arrange
            var order = Context.Orders.First();

            OperationsRepository.Setup(x => x.Delete(It.IsAny<DateTime>(), order.UserId)).ReturnsAsync(true).Verifiable();

            Mediator.Setup(x => x.Send(It.IsAny<DeleteOrderCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var deleteOrderCommand = new DeleteOrderCommand(order.Client, order);

            var handler = new DeleteOrderCommandHandler(Context, OperationsRepository.Object);

            var result = await handler.Handle(deleteOrderCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);
            OperationsRepository.Verify();

            DbContextFactory.Destroy(Context);
        }
    }
}
