using Application.Leads.Queries;
using Application.Leads.QueryHandlers;
using Domain;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace Application.Tests.Leads.QueryHandlers
{
    public class ListLeadsQueryHandlerTest : BaseTest
    {
        protected ITestOutputHelper _testOutputHelper;
        public ListLeadsQueryHandlerTest(ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper;
        }

        [Theory]
        [InlineData(true, "Lead", "1u", "mid")]
        public async void Return_All_Users_Leads_Succesfully(bool allLeads, string status, string userId, string userLevel)
        {
            await seedInMemoryDb();
            var queryLeadsList = new ListLeadsQuery(userId, userLevel, allLeads, status, "name_asc");

            Mediator.Setup(x => x.Send(It.IsAny<ListLeadsQuery>(), new CancellationToken()))
                .ReturnsAsync(new List<Lead>());

            var handler = new ListLeadsQueryHandler(Context, null);
            var result = await handler.Handle(queryLeadsList, new CancellationToken());
          
            var usersContacts = Context.UserContacts.Where(x => x.UserId == userId).Where(x => x.Contact.Status == "Lead").ToList();

            List<Lead> expectedUsersLeads = new List<Lead>();
            foreach(var userContact in usersContacts)
            {
                Lead lead = new Lead
                {
                    Contact = userContact.Contact
                };
                expectedUsersLeads.Add(lead);
            }
            _testOutputHelper.WriteLine(result.Count().ToString());
            _testOutputHelper.WriteLine(expectedUsersLeads.Count().ToString());


            result.Should()
                .BeOfType<List<Lead>>().And
                .NotBeNull();
            result.Should()
                .Equal(expectedUsersLeads, result);
        }
    }
}
