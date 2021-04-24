using System;
using MediatR;

namespace Application.Users.Commands
{
    public class EditUserCommand : IRequest
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Level { get; set; }
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
