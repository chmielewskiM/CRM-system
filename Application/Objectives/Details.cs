using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Domain;
using MediatR;
using Persistence;

namespace Application.Objectives
{
    public class Details
    {
        public class Query : IRequest<Objective>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Objective>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Objective> Handle(Query request, CancellationToken cancellationToken)
            {
                var objective = await _context.Objectives.FindAsync(request.Id);

                return objective;
            }
        }
    }
}