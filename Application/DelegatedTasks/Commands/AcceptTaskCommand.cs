using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class AcceptTaskCommand : IRequest
    {
        public DelegatedTask Task { get; }
        public AcceptTaskCommand(DelegatedTask task)
        {
            Task = task;
        }
    }
}