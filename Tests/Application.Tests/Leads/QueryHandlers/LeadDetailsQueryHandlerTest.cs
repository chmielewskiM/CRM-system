using System.Threading;
using Domain;
using Application.Leads.Queries;
using System.Linq;
using System;
using Xunit;
using Moq;
using Xunit.Abstractions;
using Application.Tests;
using FluentAssertions;

namespace Application.Leads.QueryHandlers
{
    public class LeadDetailsQueryHandlerTest : BaseTest
    {
        protected ITestOutputHelper _testOutputHelper;
        public LeadDetailsQueryHandlerTest(ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper;
        }

        [Fact]
        public async void Return_Valid_Lead()
        {

            Operation operation = new Operation
            {
                Id = Guid.NewGuid(),
                Date = DateTime.Now
            };

            SaleProcess saleProcess = new SaleProcess
            {
                ContactId = Guid.NewGuid(),
                OperationId = Guid.NewGuid(),
                Operation = operation
            };

            Contact contact = new Contact { Id = saleProcess.ContactId, Name = "John", Status = "Lead" };

            Context.Contacts.Add(contact);
            Context.SaleProcess.Add(saleProcess);
            Context.SaveChanges();

            var queryDetails = new LeadDetailsQuery(Context.Contacts.Where(x => x.Name == "John").FirstOrDefault());

            Mediator.Setup(x => x.Send(It.IsAny<LeadDetailsQuery>(), new CancellationToken()))
                .ReturnsAsync(new Lead());

            var handler = new LeadDetailsQueryHandler(Context);
            var result = await handler.Handle(queryDetails, new CancellationToken());

            result.Should()
                .BeOfType<Lead>().And
                .NotBeNull();
            result.Contact.Status.Should()
                .NotBeNullOrEmpty().And
                .NotMatch("Inactive");
        }
    }
}
