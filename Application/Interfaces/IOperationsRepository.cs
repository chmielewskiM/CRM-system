
using System;
using System.Threading.Tasks;
using Domain;

namespace Application.Interfaces
{
    public interface IOperationsRepository
    {
        Task<bool> Add(Operation operation, User user);
        Task<int> Count();
        Task<bool> Delete(DateTime date, string userId);
    }
}