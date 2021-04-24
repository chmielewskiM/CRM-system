using System;
using MediatR;

namespace Application.DelegatedTasks
{
    public class UnshareTaskCommand : IRequest
    {
        public Guid Id { get; }
        public UnshareTaskCommand(Guid id)
        {
            Id = id;
        }
    }
}