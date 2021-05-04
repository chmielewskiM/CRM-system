using System.Threading;
using Domain;
using System.Linq;
using System;
using Xunit;
using Moq;
using Application.Tests;
using FluentAssertions;
using Application.Orders.Queries;
using Application.Orders;

namespace Application.Contacts.QueryHandlers
{
    public class GetOrderQueryHandlerTest : BaseTest
    {
        [Fact]
        public async void Returns_Valid_Order()
        {
            //Arrange
            Guid orderId = Context.Orders.First().Id;

            var queryGetOrder = new GetOrderQuery(orderId);

            Mediator.Setup(x => x.Send(It.IsAny<GetOrderQuery>(), new CancellationToken()))
                .ReturnsAsync(new Order());

            //Act
            var handler = new GetOrderQueryHandler(Context);

            var result = await handler.Handle(queryGetOrder, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Order>();
            result.ClientId.Should()
                .NotBeNull();
            result.Amount.Should()
                .BeGreaterThan(0);
            result.Price.Should()
                .BeGreaterThan(0);

            DbContextFactory.Destroy(Context);
        }
    }
}
