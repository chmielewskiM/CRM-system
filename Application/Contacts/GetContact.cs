using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Contacts
{
    public class GetContact
    {
        public class Query : IRequest<Contact> { 

            public String Name { get; set; }
        }

        public class Handler : IRequestHandler<Query,  Contact>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly UserManager<User> _userManager;

            public Handler(DataContext context, ILogger<List> logger, UserManager<User> userManager)
            {
                _userManager = userManager;
                _logger = logger;
                _context = context;
            }

            public async Task<Contact> Handle(Query request, CancellationToken cancellationToken)
            {Console.WriteLine("1");
            var name  = request.Name.Replace("%20"," ");
                var contact =  await _context.Contacts.FirstOrDefaultAsync(x=> x.Name == name);
                
                return contact;
                // {   
                //     Id = contact.Id,
                //     Name = contact.Name,
                //     Type = contact.Type,
                //     Company = contact.Company,
                //     PhoneNumber = contact.PhoneNumber,
                //     DateAdded = contact.DateAdded,
                //     Email = contact.Email,
                //     Notes = contact.Notes,
                //     Status = contact.Status,
                //     Orders = contact.Orders
                // };
            }
        }
    }
}