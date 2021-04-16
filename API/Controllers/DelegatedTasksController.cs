using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using MediatR;
using Application.DelegatedTasks;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    // [Produces("application/json")]
    public class DelegatedTasksController : BaseController
    {
        ///<summary>
        /// Returns list with tasks.
        ///</summary>
        ///<response code="200">Returns the list</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<CompleteTaskData>> ListTasks(bool myTasks, bool sharedTasks, bool accepted, bool refused, bool done, int activePage, int pageSize)
        {
            return await Mediator.Send(new ListTasks.Query(myTasks, sharedTasks, accepted, refused, done, activePage, pageSize));
        }

        ///<summary>
        /// Returns list with pending tasks and their count.
        ///</summary>
        ///<response code="200">Returns list with tasks count.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("pending/page{pendingActivePage}=size{pendingPageSize}")]
        public async Task<ActionResult<CompleteTaskData>> ListPendingTasks(int pendingActivePage, int pendingPageSize)
        {
            return await Mediator.Send(new ListPendingTasks.Query { PendingActivePage = pendingActivePage, PendingPageSize = pendingPageSize });
        }

        ///<summary>
        /// Returns details about the task.
        ///</summary>
        ///<response code="200">Returns details about the task.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<DelegatedTask>> TaskDetails(Guid id)
        {
            return await Mediator.Send(new TaskDetails.Query { Id = id });
        }

        ///<summary>
        /// Adds the task.
        ///</summary>
        ///<response code="200">Adds the task.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult<Unit>> AddTask(AddTask.Command command)
        {
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Edits the task.
        ///</summary>
        ///<response code="200">Task edited successfully.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> EditTask(Guid id, EditTask.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Deletes the task.
        ///</summary>
        ///<response code="200">Task deleted successfully.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> DeleteTask(Guid id)
        {
            return await Mediator.Send(new DeleteTask.Command { Id = id });
        }

        ///<summary>
        /// Shares the task with other user.
        ///</summary>
        ///<response code="200">Task deleted successfully.</response>
        ///<response code="403">Task is shared already.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("{id}/share/{username}")]
        public async Task<ActionResult<Unit>> ShareTask(Guid id, string username)
        {
            return await Mediator.Send(new ShareTask.Command { Id = id, Username = username });
        }

        ///<summary>
        /// Accepts shared task.
        ///</summary>
        ///<response code="200">Task accepted.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("accept/{id}")]
        public async Task<ActionResult<Unit>> AcceptTask(Guid id, AcceptTask.Command command)
        {
            // command.Id = id;
            return await Mediator.Send(new AcceptTask.Command { Id = id });
        }

        ///<summary>
        /// Refuses shared task.
        ///</summary>
        ///<response code="200">Task refused.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("refuse/{id}")]
        public async Task<ActionResult<Unit>> RefuseTask(Guid id, RefuseTask.Command command)
        {
            // command.Id = id;
            return await Mediator.Send(new RefuseTask.Command { Id = id });
        }

        ///<summary>
        /// Closes shared task.
        ///</summary>
        ///<response code="200">Task closed successfully.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("finish/{id}")]
        public async Task<ActionResult<Unit>> FinishTask(Guid id, FinishTask.Command command)
        {
            // command.Id = id;
            return await Mediator.Send(new FinishTask.Command { Id = id });
        }
    }
}
