using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using MediatR;
using Application.DelegatedTasks;
using System.Collections.Generic;

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
        public async Task<ActionResult<CompleteTasksDataViewModel>> ListTasks(bool myTasks, bool sharedTasks, bool accepted, bool refused, bool done, int activePage, int pageSize)
        {
            var tasksListQuery = new ListTasksQuery(myTasks, sharedTasks, accepted, refused, done, activePage, pageSize);
            var data = await Mediator.Send(tasksListQuery);

            return new CompleteTasksDataViewModel(Mapper.Map<List<DelegatedTask>, List<DelegatedTaskViewModel>>(data.Item1), data.Item2);
        }

        ///<summary>
        /// Returns list with pending tasks and their count.
        ///</summary>
        ///<response code="200">Returns list with tasks count.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("pending/page{pendingActivePage}=size{pendingPageSize}")]
        public async Task<ActionResult<CompleteTasksDataViewModel>> ListPendingTasks(int pendingActivePage, int pendingPageSize)
        {
            var pendingTasksListQuery = new ListPendingTasksQuery(pendingActivePage, pendingPageSize);
            var data = await Mediator.Send(pendingTasksListQuery);

            return new CompleteTasksDataViewModel(Mapper.Map<List<DelegatedTask>, List<DelegatedTaskViewModel>>(data.Item1), data.Item2);
        }

        ///<summary>
        /// Returns details about the task.
        ///</summary>
        ///<response code="200">Returns details about the task.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<DelegatedTaskViewModel>> TaskDetails(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return BadRequest("Task not found");

            return Mapper.Map<DelegatedTask, DelegatedTaskViewModel>(task);
        }

        ///<summary>
        /// Adds the task.
        ///</summary>
        ///<response code="200">Adds the task.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost]
        public async Task<ActionResult> AddTask(DelegatedTask task)
        {
            var addTaskCommand = new AddTaskCommand(task.Id, task.Type, task.Deadline, task.Notes);
            await Mediator.Send(addTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Edits the task.
        ///</summary>
        ///<response code="200">Task edited successfully.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("{id}")]
        public async Task<ActionResult> EditTask(DelegatedTask task)
        {
            var taskDetailsQuery = new TaskDetailsQuery(task.Id);
            var notFound = await Mediator.Send(taskDetailsQuery) == null;

            if (notFound)
                return BadRequest("Task not found");

            var editTaskCommand = new EditTaskCommand(task.Id, task.Type, task.Deadline, task.Notes);
            await Mediator.Send(editTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Deletes the task.
        ///</summary>
        ///<response code="200">Task deleted successfully.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return BadRequest("Task not found");

            var deleteTaskCommand = new DeleteTaskCommand(task.Id);
            await Mediator.Send(deleteTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Shares the task with other user.
        ///</summary>
        ///<response code="200">Task deleted successfully.</response>
        ///<response code="403">Task is shared already.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("{id}/share/{username}")]
        public async Task<ActionResult> ShareTask(Guid id, string username)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return BadRequest("Task not found");

            var shareTaskCommand = new ShareTaskCommand(id, username);
            await Mediator.Send(shareTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Accepts shared task.
        ///</summary>
        ///<response code="200">Task accepted.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("accept/{id}")]
        public async Task<ActionResult> AcceptTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return BadRequest("Task not found");

            var acceptTask = new AcceptTaskCommand(task.Id);
            await Mediator.Send(acceptTask);

            return NoContent();
        }

        ///<summary>
        /// Refuses shared task.
        ///</summary>
        ///<response code="200">Task refused.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("refuse/{id}")]
        public async Task<ActionResult> RefuseTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return BadRequest("Task not found");

            var refuseTask = new AcceptTaskCommand(task.Id);
            await Mediator.Send(refuseTask);

            return NoContent();
        }

        ///<summary>
        /// Closes shared task.
        ///</summary>
        ///<response code="200">Task closed successfully.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("finish/{id}")]
        public async Task<ActionResult> FinishTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return BadRequest("Task not found");

            var finishTask = new FinishTaskCommand(task.Id);
            await Mediator.Send(finishTask);

            return NoContent();
        }
    }
}
