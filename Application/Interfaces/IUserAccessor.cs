using System.Threading.Tasks;
using Domain;

namespace Application.Interfaces
{
    public interface IUserAccessor
    {
        string GetLoggedUsername();
        Task<User> GetLoggedUser();
    }
}