using System;
using MediatR;

namespace Application.Users.Commands
{
    public class EditUserCommand : IRequest
    {
        public string Id { get; }
        public string DisplayName { get; }
        public string Username { get; }
        public string Email { get; }
        public string Password { get; }
        public string Level { get; }
        public EditUserCommand(string id, string displayName, string username, string email, string password, string level)
        {
            Id = id;
            DisplayName = displayName;
            Username = username;
            Email = email;
            Password = password;
            Level = level;
        }
    }
}
