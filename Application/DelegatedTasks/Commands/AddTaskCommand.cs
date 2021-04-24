using System;
using MediatR;

namespace Application.DelegatedTasks
{
    public class AddTaskCommand : IRequest
    {
        public Guid Id { get; }
        public string Type { get; }
        public DateTime DateStarted { get; }
        public DateTime Deadline { get; }
        public string Notes { get; }
        public Boolean Accepted { get; }
        public Boolean Refused { get; }
        public Boolean Pending { get; }
        public Boolean Done { get; }
        public string FinishedBy { get; }
        public AddTaskCommand(Guid id, string type, DateTime deadline, string notes)
        {
            Id = id;
            Type = type;
            Deadline = deadline;
            Notes = notes;
            DateStarted = DateTime.Now;
            Accepted = true;
            Refused = false;
            Pending = false;
            Done = false;
            FinishedBy = "";
        }
    }
}