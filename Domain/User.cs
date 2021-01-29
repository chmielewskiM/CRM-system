using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class User : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Level { get; set; }
        public virtual ICollection<UserContact> UserContacts { get; set; }
        public virtual ICollection<UserTask> UserTasks { get; set; }
        public virtual ICollection<UserOperation> UserOperations { get; set; }
    }
}