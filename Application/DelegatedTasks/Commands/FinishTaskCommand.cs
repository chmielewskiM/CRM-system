using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class FinishTaskCommand : IRequest
    {
        public DelegatedTask Task { get; }

        public FinishTaskCommand(DelegatedTask task)
        {
            Task = task;
        }
    }
}