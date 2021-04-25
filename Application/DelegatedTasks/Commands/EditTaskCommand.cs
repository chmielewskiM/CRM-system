using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class EditTaskCommand : IRequest
    {
        public DelegatedTask Task { get; }
        public string Type { get; }
        public DateTime Deadline { get; }
        public string Notes { get; }

        public EditTaskCommand(DelegatedTask task, string type, DateTime deadline, string notes)
        {
            Task = task;
            Type = type;
            Deadline = deadline;
            Notes = notes;
        }
    }
}