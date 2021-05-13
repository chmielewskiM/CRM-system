using System.Threading;
using Domain;
using Xunit;
using Moq;
using FluentAssertions;
using Application.Orders.Queries;
using Application.Orders.QueryHandlers;
using System.Collections.Generic;

namespace Application.Tests.Orders.QueryHandlers
{
    public class ListOrdersQueryHandlerTest : BaseTest
    {
        [Fact]
        public async void Returns_List_With_Orders_Successfully()
        {
            //Arrange
            var queryOrdersList = new ListOrdersQuery("allOrders", "true", "false", "name", "", 1, 5);

            Mediator.Setup(x => x.Send(It.IsAny<ListOrdersQuery>(), new CancellationToken()))
                .ReturnsAsync((new List<Order>(), It.IsAny<int>()));

            //Act
            var handler = new ListOrdersQueryHandler(Context);
            var result = await handler.Handle(queryOrdersList, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<(List<Order>, int)>();

            DbContextFactory.Destroy(Context);
        }
    }
}
