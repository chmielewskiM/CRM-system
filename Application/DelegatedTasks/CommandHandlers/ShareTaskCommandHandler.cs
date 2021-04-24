using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DelegatedTasks
{
 public class ShareTaskCommandHandler: IRequestHandler<ShareTaskCommand>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<User> _userManager;

            public ShareTaskCommandHandler(DataContext context, IUserAccessor userAccessor, UserManager<User> userManager)
            {
                _userManager = userManager;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(ShareTaskCommand request, CancellationToken cancellationToken)
            {
                var task = await _context
                    .DelegatedTasks
                    .FindAsync(request.Id);

                var user = await _userManager.FindByNameAsync(_userAccessor.GetLoggedUsername());
                var targetUser = await _userManager.FindByNameAsync(request.Username);

                var share = await _context
                    .UserTasks
                    .SingleOrDefaultAsync(x => x.DelegatedTaskId == task.Id && x.SharedWith.Id == user.Id);

                // if (share != null)
                //     throw new RestException(HttpStatusCode.Forbidden,
                //     new { message = "Already shared with this employee" });

                task.Accepted = false;
                task.Refused = false;
                task.Pending = true;

                share = await _context.UserTasks.SingleOrDefaultAsync(x => x.DelegatedTask == task);

                share.SharedWith = targetUser;
                share.SharedWithId = targetUser.Id;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new System.Exception("Problem saving changes");
            }
        }
}