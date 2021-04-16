using System.Threading;
using System.Threading.Tasks;
using System;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using System.Net;
using Application.Errors;

namespace Application.Contacts
{
    public class GetContact
    {
        public class Query : IRequest<Contact>
        {

            public String Name { get; set; }
        }

        public class Handler : IRequestHandler<Query, Contact>
        {
            private readonly DataContext _context;
            private readonly ILogger<GetContact> _logger;
            private readonly UserManager<User> _userManager;

            public Handler(DataContext context, ILogger<GetContact> logger, UserManager<User> userManager)
            {
                _userManager = userManager;
                _logger = logger;
                _context = context;
            }

            public async Task<Contact> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.Name == "" | request.Name == null)
                    throw new RestException(HttpStatusCode.BadRequest, "Requested name is empty.");

                var name = request.Name.Replace("%20", " ");
                var contact = await _context.Contacts.FirstOrDefaultAsync(x => x.Name == name);

                return contact;
            }
        }
    }
}