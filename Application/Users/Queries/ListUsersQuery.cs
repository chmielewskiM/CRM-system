using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Users.Queries
{
    public class ListUsersQuery : IRequest<List<User>> { }
}
