
// using System.Threading.Tasks;
// using Application.Interfaces;
// using MediatR;
// using Persistence;
// using Application.Contacts.Commands;
// using System.Threading;
// using Application.Errors;
// using System.Net;
// using Domain;
// using Microsoft.EntityFrameworkCore;
// using System;

// ////////////////////////////////////////////
// //////
// //////     *** FEATURE NOT IMPLEMENTED ***
// //////
// ////////////////////////////////////////////

// namespace Application.Contacts.CommandHandlers
// {
//     public class ShareContactCommandHandler : IRequestHandler<ShareContactCommand>
//         {
//             private readonly DataContext _context;
//             private readonly IUserAccessor _userAccessor;

//             public ShareContactCommandHandler(DataContext context, IUserAccessor userAccessor)
//             {
//                 _userAccessor = userAccessor;

//                 _context = context;
//             }

//             public async Task<Unit> Handle(ShareContactCommand request, CancellationToken cancellationToken)
//             {
//                 var contact = await _context
//                     .Contacts
//                     .FindAsync(request.Id);

//                 if (contact == null)
//                     throw new RestException(HttpStatusCode.NotFound, new
//                     {
//                         Contact = "Could not find contact"
//                     });

//                 var user = await _context
//                     .Users
//                     .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

//                 var share = await _context
//                     .UserContacts
//                     .SingleOrDefaultAsync(x => x.ContactId == contact.Id && x.UserId.Equals(user.Id));

//                 if (share != null)
//                     throw new RestException(HttpStatusCode.BadRequest,
//                     new { Assign = "Already shared to the contact" });

//                 share = new UserContact
//                 {
//                     Contact = contact,
//                     User = user,
//                     DateAdded = DateTime.Now
//                 };

//                 _context.UserContacts.Add(share);

//                 var success = await _context.SaveChangesAsync() > 0;

//                 if (success)
//                     return Unit.Value;

//                 throw new System.Exception("Problem saving changes");
//             }
//     }
// }