using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;
        public UserAccessor(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public string GetLoggedUsername()
        {
            var username = _httpContextAccessor.HttpContext.User?.Claims?.Single(x =>
            x.Type == ClaimTypes.NameIdentifier)?.Value;

            return username;
        }

        public async Task<User> GetLoggedUser()
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == GetLoggedUsername());

            if (user == null)
                throw new Exception("User not found");

            return user;
        }
    }
}