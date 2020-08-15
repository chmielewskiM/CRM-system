using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class User : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Level { get; set; }
        public ICollection<UserContact> UserContacts { get; set; }
    }
}