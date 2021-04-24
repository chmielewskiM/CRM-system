using System;
using MediatR;

namespace Application.DelegatedTasks
{
    public class AcceptTaskCommand : IRequest
    {
        public Guid Id { get; }
        public AcceptTaskCommand(Guid id)
        {
            Id = id;
        }
    }
}