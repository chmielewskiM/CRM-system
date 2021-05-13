using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Operations.Repository
{
    public class OperationsRepository : IOperationsRepository
    {
        private readonly DataContext _context;
        
        public OperationsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Operation operation, User user)
        {
            operation.Id = Guid.NewGuid();
            if (operation.Source == null)
                operation.Source = "";

            await _context.Operations.AddAsync(operation);

            var userOperation = new UserOperation
            {
                User = user,
                UserId = user.Id,
                Operation = operation,
                OperationId = operation.Id,
                DateAdded = DateTime.Now
            };

            await _context.UserOperations.AddAsync(userOperation);

            return true;
        }

        public async Task<int> Count()
        {
            var operationsCount = await _context.Operations.CountAsync();

            return operationsCount;
        }

        public async Task<bool> Delete(DateTime date, string userId)
        {
            var operation = _context.Operations.SingleOrDefault(x => x.Date.Millisecond == date.Millisecond);
            if (operation.UserOperation == null) return false;

            _context.Operations.Remove(operation);

            var userOperation = await _context.UserOperations.FindAsync(userId, operation.Id);
            if (userOperation == null) return false;

            _context.UserOperations.Remove(userOperation);

            return true;
        }

    }
}