using System.Threading;
using System.Linq;
using Xunit;
using Moq;
using FluentAssertions;
using Application.Orders.Commands;
using MediatR;
using Domain;
using Application.Orders.CommandHandlers;

namespace Application.Tests.Orders.CommandHandlers
{
    public class CloseOrderCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Closes_Order_Successfully()
        {
            //Arrange
            var order = Context.Orders.First();
            var user = Context.Users.FirstOrDefault(x=>x.Id == order.UserId);

            UserAccessor.Setup(x => x.GetLoggedUser()).ReturnsAsync(user).Verifiable();
            OperationsRepository.Setup(x => x.Add(It.IsAny<Operation>(), It.IsAny<User>())).ReturnsAsync(true).Verifiable();
            Mediator.Setup(x => x.Send(It.IsAny<CloseOrderCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var closeOrderCommand = new CloseOrderCommand(order);
            var handler = new CloseOrderCommandHandler(Context, UserAccessor.Object, OperationsRepository.Object);
            var result = await handler.Handle(closeOrderCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);
            OperationsRepository.Verify();

            DbContextFactory.Destroy(Context);
        }
    }
}
