using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using MediatR;
using System.Threading;
using Application.DelegatedTasks;

namespace API.Controllers
{
    public class DelegatedTaskController : BaseController
    {
        private readonly IMediator _mediator;
        public DelegatedTaskController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<CompleteTaskData>> ListTasks(bool myTasks, bool accepted, bool refused, bool pending, bool done)
        {
            return await Mediator.Send(new ListTasks.Query(myTasks, accepted, refused, pending, done));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DelegatedTask>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Add(Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/share/{username}")]
        public async Task<ActionResult<Unit>> Share(Guid id, string username)
        {
            return await Mediator.Send(new ShareTask.Command { Id = id, Username = username });
        }
        [HttpPost("accept/{id}")]
        public async Task<ActionResult<Unit>> AcceptTask(Guid id, AcceptTask.Command command)
        {
            // command.Id = id;
            return await Mediator.Send(new AcceptTask.Command { Id = id });
        }
        [HttpPost("refuse/{id}")]
        public async Task<ActionResult<Unit>> RefuseTask(Guid id, RefuseTask.Command command)
        {
            // command.Id = id;
            return await Mediator.Send(new RefuseTask.Command { Id = id });
        }
        [HttpPost("finish/{id}")]
        public async Task<ActionResult<Unit>> CloseTask(Guid id, FinishTask.Command command)
        {
            // command.Id = id;
            return await Mediator.Send(new FinishTask.Command { Id = id });
        }
    }
}
