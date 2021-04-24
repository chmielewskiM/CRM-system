using System;
using MediatR;

namespace Application.DelegatedTasks
{
    public class EditTaskCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public DateTime Deadline { get; set; }
        public string Notes { get; set; }
        public EditTaskCommand(Guid id, string type, DateTime deadline, string notes)
        {
            Id = id;
            Type = type;
            Deadline = deadline;
            Notes = notes;
        }
    }
}