using MediatR;

namespace Application.Users.Commands
{
    public class DeleteUserCommand : IRequest
    {
        public string Username { get; set; }
        public DeleteUserCommand(string username)
        {
            Username = username;
        }
    }

}
