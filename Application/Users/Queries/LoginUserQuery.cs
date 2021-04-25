using Application.Users.ViewModels;
using Domain;
using MediatR;

namespace Application.Users.Queries
{
    public class LoginUserQuery : IRequest<UserViewModel>
    {
        public User User { get; }
        public string Password { get; }

        public LoginUserQuery(User user, string password)
        {
            User = user;
            Password = password;
        }
    }
}
