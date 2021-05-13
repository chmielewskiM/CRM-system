using System.Threading;
using Domain;
using Xunit;
using Moq;
using FluentAssertions;
using MediatR;
using System.Linq;
using Application.Orders;

namespace Application.Tests.Orders.CommandHandlers
{
    public class AddOrderCommandHandlerTest : BaseTest
    {
        [Fact]
        public async void Adds_New_Order_Successfully()
        {
            //Arrange
            var contact = Context.Contacts.First();
            var user = Context.Users.First();

            UserAccessor.Setup(x => x.GetLoggedUser()).ReturnsAsync(user);
            OperationsRepository.Setup(x => x.Add(It.IsAny<Operation>(), user)).ReturnsAsync(true).Verifiable();
            Mediator.Setup(x => x.Send(It.IsAny<AddOrderCommand>(), new CancellationToken()))
                .ReturnsAsync(Unit.Value);

            //Act
            var addOrderCommand = new AddOrderCommand(contact, true, "test", 10, 100, "");
            var handler = new AddOrderCommandHandler(Context, UserAccessor.Object, OperationsRepository.Object);
            var result = await handler.Handle(addOrderCommand, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Unit>()
                .Equals(Unit.Value);

            DbContextFactory.Destroy(Context);
        }
    }
}
