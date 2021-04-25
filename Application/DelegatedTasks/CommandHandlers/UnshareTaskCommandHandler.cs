////////////////////////////////////////////
//////
//////     *** FEATURE NOT IMPLEMENTED ***
//////
////////////////////////////////////////////

// using System;
// using System.Threading;
// using System.Threading.Tasks;
// using Application.Interfaces;
// using Domain;
// using MediatR;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using Persistence;

// namespace Application.DelegatedTasks
// {
//  public class UnshareTaskCommandHandler: IRequestHandler<UnshareTaskCommand>
//         {
//             private readonly DataContext _context;
//             private readonly IUserAccessor _userAccessor;
//             private readonly UserManager<User> _userManager;

//             public UnshareTaskCommandHandler(DataContext context, IUserAccessor userAccessor, UserManager<User> userManager)
//             {
//                 _userManager = userManager;
//                 _userAccessor = userAccessor;
//                 _context = context;
//             }
//             public async Task<Unit> Handle(UnshareTaskCommand request, CancellationToken cancellationToken)
//             {
//                 var task = await _context
//                     .DelegatedTasks
//                     .FindAsync(request.Id);

//                 // if (task == null)
//                 //     throw new RestException(HttpStatusCode.NotFound, new
//                 //     {
//                 //         Task = "Could not find task"
//                 //     });

//                 var share = await _context
//                     .UserTasks
//                     .SingleOrDefaultAsync(x => x.DelegatedTaskId == task.Id);

//                 // if (share.SharedWithId == null)
//                 //     throw new RestException(HttpStatusCode.BadRequest,
//                 //     new { Assign = "This task is not shared with anyone." });

//                 task.Pending = false;
//                 share.SharedWith = null;
//                 share.SharedWithId = null;

//                 var success = await _context.SaveChangesAsync() > 0;

//                 if (success)
//                     return Unit.Value;

//                 throw new System.Exception("Problem saving changes");
//             }
//         }
// }