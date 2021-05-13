using Domain;
using Xunit;
using Moq;
using FluentAssertions;
using System.Linq;
using System;

namespace Application.Tests.Operations.Repository
{
    public class OperationsRepositoryTest : BaseTest
    {
        [Fact]
        public async void Adds_New_Operation_Successfully()
        {
            //Arrange
            var user = Context.Users.First();
            var operation = new Operation
            {
                Opportunity = true,
                Date = DateTime.Now,
            };

            OperationsRepository.Setup(x => x.Add(It.IsAny<Operation>(), user)).ReturnsAsync(true).Verifiable();

            //Act
            var result = await OperationsRepository.Object.Add(operation, user);

            //Assert
            result.Should()
                .BeTrue();
            OperationsRepository.Verify();

            DbContextFactory.Destroy(Context);
        }

        [Fact]
        public async void Deletes_Operation_Successfully()
        {
            //Arrange
            var user = Context.Users.First();
            var operation = Context.Operations.First();

            OperationsRepository.Setup(x => x.Delete(It.IsAny<DateTime>(), user.Id)).ReturnsAsync(true).Verifiable();

            //Act
            var result = await OperationsRepository.Object.Delete(operation.Date, user.Id);

            //Assert
            result.Should()
                .BeTrue();
            OperationsRepository.Verify();

            DbContextFactory.Destroy(Context);
        }
        
        [Fact]
        public async void Counts_Operations()
        {
            //Act
            var result = await OperationsRepository.Object.Count();
            var expected = Context.Operations.Count();

            //Assert
            result.Should()
                .Equals(expected);
            OperationsRepository.Verify();

            DbContextFactory.Destroy(Context);
        }
    }
}
