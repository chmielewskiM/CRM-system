using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Contacts
{
    public class List
    {
        public class Query : IRequest<List<ContactDTO>> { }
        public class Handler : IRequestHandler<Query, List<ContactDTO>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<List<ContactDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var contacts = await _context.Contacts
                .Include(x => x.UserContacts)
                .ThenInclude(x => x.User)
                .ToListAsync();

                return _mapper.Map<List<Contact>, List<ContactDTO>>(contacts);
            }
        }
    }
}