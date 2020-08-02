using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Domain;
using MediatR;
using Persistence;

namespace Application.Materials
{
    public class Details
    {
        public class Query : IRequest<Material>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Material>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Material> Handle(Query request, CancellationToken cancellationToken)
            {
                var material = await _context.Materials.FindAsync(request.Id);

                return material;
            }
        }
    }
}