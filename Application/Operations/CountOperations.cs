using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Persistence;

namespace Application.Operations
{
    public class CountOperations
    {
        public class Query : IRequest<Int32>
        {
        }
        public class Handler : IRequestHandler<Query, Int32>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Int32> Handle(Query request, CancellationToken ct)
            {
                var operationsCount = await _context.Operations.CountAsync();

                return operationsCount;
            }
        }
    }
}