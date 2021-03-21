using System;
using System.Threading.Tasks;
using Persistence;
using Domain;

namespace Application.Operations
{
    public class Add : Operation
    {
        public Add()
        {
            Id = Guid.NewGuid();
            Lead = 0;
            Opportunity = 0;
            Quote = 0;
            Invoice = 0;
            Conversion = 0;
            Order = 0;
            Revenue = 0;
            Source = "";
            Date = DateTime.Now;
        }
        public async Task addOperation(Operation operation, DataContext context, User user)
        {

            await context.Operations.AddAsync(operation);

            var userOperation = new UserOperation
            {
                User = user,
                UserId = new Guid(user.Id),
                Operation = operation,
                OperationId = operation.Id,
                DateAdded = DateTime.Now
            };

            await context.UserOperations.AddAsync(userOperation);
        }
    }
}