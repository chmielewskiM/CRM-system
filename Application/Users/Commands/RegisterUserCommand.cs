using System;
using Domain;
using MediatR;

namespace Application.Users.Commands
{
    public class RegisterUserCommand : IRequest
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Level { get; set; }

        public RegisterUserCommand(string username, string displayName, string password, string email, string level)
        {
            Username = username;
            DisplayName = displayName;
            Password = password;
            Email = email;
            Level = level;
        }
    }
}
