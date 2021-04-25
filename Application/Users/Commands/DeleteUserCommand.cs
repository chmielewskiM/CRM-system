using Domain;
using MediatR;

namespace Application.Users.Commands
{
    public class DeleteUserCommand : IRequest
    {
        public User User { get; set; }
        public DeleteUserCommand(User user)
        {
            User = user;
        }
    }

}
