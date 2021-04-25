using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class ShareTaskCommand : IRequest
    {
        public DelegatedTask Task { get; }
        public string SharedById { get; }
        public User SharedWithUser { get; }

        public ShareTaskCommand(DelegatedTask task, string sharedById, User sharedWithUser)
        {
            Task = task;
            SharedById = sharedById;
            SharedWithUser = sharedWithUser;
        }
    }
}