
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Users.Commands;
using System.Threading;
using System;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using Domain;

namespace Application.Users.CommandHandlers
{
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
        {
            private readonly DataContext _context;
            private readonly UserManager<User> _userManager;

            public DeleteUserCommandHandler(DataContext context, UserManager<User> userManager)
            {
                _userManager = userManager;
                _context = context;
            }

            public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var user = await _userManager.FindByNameAsync(request.Username);
                    IQueryable<UserTask> userTasks = _context.UserTasks.Where(x => x.SharedWith == user);

                    foreach (UserTask userTask in userTasks)
                    {
                        userTask.SharedWith = null;
                        userTask.SharedWithId = null;
                        userTask.DelegatedTask.Pending = false;
                    }

                    IQueryable<DelegatedTask> tasks = _context.DelegatedTasks.Where(x => x.UserTask.CreatedBy == user);

                    _context.DelegatedTasks.RemoveRange(tasks);

                    _context.Users.Remove(user);

                    await _userManager.DeleteAsync(user);

                    await _context.SaveChangesAsync();

                    return Unit.Value;
                }
                catch
                {

                    throw new Exception("Failed to delete the user.");
                }
            }
        }
}
