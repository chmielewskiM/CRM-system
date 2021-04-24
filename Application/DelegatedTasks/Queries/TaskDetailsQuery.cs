using System;
using MediatR;
using Domain;

namespace Application.DelegatedTasks
{
    public class TaskDetailsQuery : IRequest<DelegatedTask>
    {
        public Guid Id { get; }
        public TaskDetailsQuery(Guid id)
        {
            Id = id;
        }
    }
}