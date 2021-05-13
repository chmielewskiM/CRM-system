using System.Threading;
using Domain;
using System.Linq;
using System;
using Xunit;
using Moq;
using FluentAssertions;
using Application.Contacts.Queries;
using Application.Contacts.QueryHandlers;

namespace Application.Tests.Contacts.QueryHandlers
{
    public class ContactDetailsQueryHandlerTest : BaseTest
    {
        [Fact]
        public async void Returns_Contacts_Details()
        {
            //Arrange
            Guid contactId = Context.Contacts.First().Id;
            var queryContactDetails = new ContactDetailsQuery(contactId);

            Mediator.Setup(x => x.Send(It.IsAny<ContactDetailsQuery>(), new CancellationToken()))
                .ReturnsAsync(new Contact());

            //Act
            var handler = new ContactDetailsQueryHandler(Context);
            var result = await handler.Handle(queryContactDetails, new CancellationToken());

            //Assert
            result.Should()
                .BeOfType<Contact>();
            result.Status.Should()
                .NotBeNullOrEmpty();

            DbContextFactory.Destroy(Context);
        }        
    }
}
