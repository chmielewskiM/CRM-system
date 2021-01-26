using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.DelegatedTasks
{
    public class List
    {
        public class Query : IRequest<List<DelegatedTask>>
        {
            // public DateTime? Deadline { get; set; }
            // public Query(DateTime? deadline)
            // {
            //     Deadline = deadline;
            // }
        }
        public class Handler : IRequestHandler<Query, List<DelegatedTask>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;

            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;
            }

            public async Task<List<DelegatedTask>> Handle(Query request, CancellationToken cancellationToken)
            {
                // var queryable = _context.DelegatedTasks
                //     .Where(x => x.Deadline >= request.Deadline)
                //     .OrderBy(x => x.Deadline)
                //     .AsQueryable();
                try
                {
                    for (var i = 0; i < 10; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(10, cancellationToken);
                        _logger.LogInformation($"Task {i} has completed");
                    }
                }
                catch (Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation("Task was cancelled");
                }
                var delegatedTasks = await _context.DelegatedTasks.ToListAsync();

                return delegatedTasks;
            }
        }
    }
}