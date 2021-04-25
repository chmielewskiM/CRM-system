using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class RefuseTaskCommand : IRequest
    {
        public DelegatedTask Task { get; }

        public RefuseTaskCommand(DelegatedTask task)
        {
            Task = task;
        }
    }
}