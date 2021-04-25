using Domain;
using MediatR;

namespace Application.Users.Queries
{
    public class GetUserQuery : IRequest<User>
    {
        public string Username { get; }

        public GetUserQuery(string username)
        {
            Username = username;
        }
    }
}
