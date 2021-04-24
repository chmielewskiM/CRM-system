using Application.Users.ViewModels;
using MediatR;

namespace Application.Users.Queries
{
    public class LoginUserQuery : IRequest<UserViewModel>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
