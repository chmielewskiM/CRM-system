using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class ShareTaskCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public ShareTaskCommand(Guid id, string username)
        {
            Id = id;
            Username = username;
        }
    }
}