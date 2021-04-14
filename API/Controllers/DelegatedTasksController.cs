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
    public class DelegatedTasksController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<CompleteTaskData>> ListTasks(bool myTasks, bool sharedTasks, bool accepted, bool refused, bool done, int activePage, int pageSize)
        {
            return await Mediator.Send(new ListTasks.Query(myTasks, sharedTasks, accepted, refused, done, activePage, pageSize));
        }
        [HttpGet("pending/page{pendingActivePage}=size{pendingPageSize}")]
        public async Task<ActionResult<CompleteTaskData>> ListPendingTasks(int pendingActivePage, int pendingPageSize)
        {
            return await Mediator.Send(new ListPendingTasks.Query { PendingActivePage = pendingActivePage, PendingPageSize = pendingPageSize });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DelegatedTask>> TaskDetails(Guid id)
        {
            return await Mediator.Send(new TaskDetails.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> AddTask(AddTask.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditTask(Guid id, EditTask.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteTask(Guid id)
        {
            return await Mediator.Send(new DeleteTask.Command { Id = id });
        }

        [HttpPost("{id}/share/{username}")]
        public async Task<ActionResult<Unit>> ShareTask(Guid id, string username)
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
