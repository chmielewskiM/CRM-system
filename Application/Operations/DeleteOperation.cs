using System.Linq;
using System.Threading.Tasks;
using Persistence;
using Domain;
using System;

namespace Application.Operations
{
    public class DeleteOperation
    {
        public static async Task deleteOperation(DateTime date, DataContext context, Guid? userId)
        {
            Operation operation = new Operation();

            operation = context.Operations.FirstOrDefault(x => x.Date == date);

            if (userId != null)
            {
                var userOperation = await context.UserOperations.FindAsync(userId, operation.Id);

                context.UserOperations.Remove(userOperation);
            }

            context.Operations.Remove(operation);

        }
    }
}