using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class DeleteTaskCommand : IRequest
    {
        public string Username { get; }
        public DelegatedTask Task { get; }

        public DeleteTaskCommand(string username, DelegatedTask task)
        {
            Username = username;
            Task = task;
        }
    }
}