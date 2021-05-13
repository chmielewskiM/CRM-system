using System.Threading;
using Domain;
using System.Linq;
using Xunit;
using Moq;
using FluentAssertions;
using Application.Contacts.Queries;
using Application.QueryHandlers;

namespace Application.Tests.Contacts.QueryHandlers
{
    public class GetContactByNameQueryHandlerTest : BaseTest
    {
        [Fact]
        public async void Returns_Valid_Contact_By_Name()
        {
            //Arrange
            string contactName = Context.Contacts.First().Name;
            var queryGetContactByName = new GetContactByNameQuery(contactName);

            Mediator.Setup(x => x.Send(It.IsAny<GetContactByNameQuery>(), new CancellationToken()))
                .ReturnsAsync(new Contact());

            //Act
            var handler = new GetContactByNameQueryHandler(Context);
            var result = await handler.Handle(queryGetContactByName, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Contact>();
            result.Status.Should()
                .NotBeNullOrEmpty();

            DbContextFactory.Destroy(Context);
        }        
    }
}
