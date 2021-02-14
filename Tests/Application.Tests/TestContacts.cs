using System;
using Xunit;
using Domain;
namespace ApplicationTests
{
    public class TestContacts
    {
        [Fact]
        public void IsProperTypeOnAdd()
        {
            var user = new Contact{
                Name="aa",
                Type="",
                Company="",
                PhoneNumber="",
                Email="",
                DateAdded= new DateTime(),
                Notes=""
            };
            Assert.NotEmpty(user.Name);
        }
        [Fact]
        public void IsNullOnAdd()
        {
            var user = new Contact();

            Assert.Null(user.Name);
            Assert.Null(user.Type);
            Assert.Null(user.Company);
            Assert.Null(user.PhoneNumber);
            Assert.Null(user.Email);
            Assert.Null(user.Notes);
        }
    }
}
