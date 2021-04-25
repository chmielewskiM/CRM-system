using System;

namespace Application.Users.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Level { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}