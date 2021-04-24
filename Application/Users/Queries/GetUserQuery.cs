using Domain;
using MediatR;

namespace Application.Users.Queries
{
    public class GetUserQuery : IRequest<User>
    {
        public string Username { get; set; }
    }
}
