using Application.Users.ViewModels;
using Domain;
using MediatR;

namespace Application.Users.Queries
{
    public class LoggedUserQuery : IRequest<User> { }
}
