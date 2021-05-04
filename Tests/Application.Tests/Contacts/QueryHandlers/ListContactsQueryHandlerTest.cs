using Application.Contacts.Queries;
using Application.Contacts.QueryHandlers;
using Domain;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Xunit;

namespace Application.Tests.Contacts.QueryHandlers
{
    public class ListContactsQueryHandlerTest : BaseTest
    {
        [Fact]
        public async void Returns_List_With_Contacts_Succesfully()
        {
            //Arrange
            User user = Context.Users.First();

            var queryContactsList = new ListContactsQuery(user, false, false, "name_desc", 1, 5, "", false);

            Mediator.Setup(x => x.Send(It.IsAny<ListContactsQuery>(), new CancellationToken()))
                .ReturnsAsync((new List<Contact>(), It.IsAny<int>()));

            //Act
            var handler = new ListContactsQueryHandler(Context, null);

            var result = await handler.Handle(queryContactsList, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<(List<Contact>, int)>();

            DbContextFactory.Destroy(Context);
        }
    }
}
