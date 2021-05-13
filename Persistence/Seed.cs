using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<User> userManager)
        {
            var users = new List<User> { };

            if (!userManager.Users.Any())
            {
                users = new List<User> {
                    new User {
                        DisplayName = "Admin",
                        UserName = "Admin",
                        Email = "admin@sb.com",
                        Level = "top"
                    },
                    new User {
                        DisplayName = "Manager",
                        UserName = "Manager",
                        Email = "manager@sb.com",
                        Level = "mid"
                    },
                    new User {
                        DisplayName = "Manager-2",
                        UserName = "Manager-2",
                        Email = "manager-2@sb.com",
                        Level = "mid"
                    },
                    new User {
                        DisplayName = "Employee",
                        UserName = "Employee",
                        Email = "employee@sb.com",
                        Level = "low"
                    },
                    new User {
                        DisplayName = "Employee-2",
                        UserName = "Employee-2",
                        Email = "employee2@sb.com",
                        Level = "low"
                    }
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Qw123!");
                }

            }

        }
    }
}
