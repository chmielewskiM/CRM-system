using System;
using MediatR;

namespace Application.DelegatedTasks
{
    public class RefuseTaskCommand : IRequest
    {
        public Guid Id { get; }
        public RefuseTaskCommand(Guid id)
        {
            Id = id;
        }
    }
}