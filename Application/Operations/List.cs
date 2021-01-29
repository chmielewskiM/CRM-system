using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Operations;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Operations
{
    public class List
    {
        public class Query : IRequest<List<OperationDTO>> { }
        public class Handler : IRequestHandler<Query, List<OperationDTO>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<List<OperationDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var operations = await _context.Operations
                .ToListAsync();
                var operationsOwnedByUser = new List<Domain.Operation>();
                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                if (user.Level == "top")
                return _mapper.Map<List<Domain.Operation>, List<OperationDTO>>(operations);
                
                foreach (var operation in operations)
                {
                    var userHasOperation = await _context.UserOperations.SingleOrDefaultAsync(x => x.OperationId == operation.Id && x.UserId == user.Id);
                }

                return _mapper.Map<List<Domain.Operation>, List<OperationDTO>>(operationsOwnedByUser);
            }
        }
    }
}