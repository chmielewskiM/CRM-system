using System;
using MediatR;

namespace Application.DelegatedTasks
{
    public class DeleteTaskCommand : IRequest
    {
        public Guid Id { get; }
        public DeleteTaskCommand(Guid id)
        {
            Id = id;
        }
    }
}