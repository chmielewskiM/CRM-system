using System;

namespace Application.AppUser
{
    public class AppUser
    {
        public Guid Id { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Level { get; set; }
        public string Email { get; set; }
    }
}