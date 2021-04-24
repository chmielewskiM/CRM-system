using System;
using MediatR;

namespace Application.DelegatedTasks
{
    public class FinishTaskCommand : IRequest
    {
        public Guid Id { get; }
        // public string UserDisplayName { get; }
        public FinishTaskCommand(Guid id)
        {
            Id = id;
            // UserDisplayName = userDisplayName;
        }
    }
}