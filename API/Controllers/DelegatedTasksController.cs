using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Application.DelegatedTasks;
using System.Collections.Generic;
using Application.Users.Queries;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Http;

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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CompleteTasksDataViewModel))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CompleteTasksDataViewModel))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("pending/page{pendingActivePage}=size{pendingPageSize}")]
        public async Task<ActionResult<CompleteTasksDataViewModel>> ListPendingTasks(int pendingActivePage, int pendingPageSize)
        {
            var loggedUserQuery = new LoggedUserQuery();
            User user = await Mediator.Send(loggedUserQuery);

            var pendingTasksListQuery = new ListPendingTasksQuery(user.Id, pendingActivePage, pendingPageSize);
            var data = await Mediator.Send(pendingTasksListQuery);

            return new CompleteTasksDataViewModel(Mapper.Map<List<DelegatedTask>, List<DelegatedTaskViewModel>>(data.Item1), data.Item2);
        }

        ///<summary>
        /// Returns details about the task.
        ///</summary>
        ///<response code="200">Returns details about the task.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Server error.</response>
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DelegatedTaskViewModel))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
        ///<response code="204">Adds the task.</response>
        ///<response code="400">Failed validation (fluent validation).</response>
        ///<response code="500">Problem saving changes.</response>
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost]
        public async Task<ActionResult> AddTask([CustomizeValidator(Interceptor = typeof(API.Middleware.ValidatorInterceptor))] DelegatedTaskViewModel task)
        {
            var addTaskCommand = new AddTaskCommand(task.Type, task.Deadline, task.Notes);
            await Mediator.Send(addTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Edits the task.
        ///</summary>
        ///<response code="204">Task edited successfully.</response>
        ///<response code="400">Failed validation (fluent validation).</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPut("{id}")]
        public async Task<ActionResult> EditTask([CustomizeValidator(Interceptor = typeof(API.Middleware.ValidatorInterceptor))] DelegatedTaskViewModel task)
        {
            var taskDetailsQuery = new TaskDetailsQuery(task.Id);
            var taskQuery = await Mediator.Send(taskDetailsQuery);

            if (taskQuery == null)
                return BadRequest("Task not found");

            var editTaskCommand = new EditTaskCommand(taskQuery, task.Type, task.Deadline, task.Notes);
            await Mediator.Send(editTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Deletes the task.
        ///</summary>
        ///<response code="204">Task deleted successfully.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return NotFound("Task not found");

            var loggedUserQuery = new LoggedUserQuery();
            User user = await Mediator.Send(loggedUserQuery);

            var deleteTaskCommand = new DeleteTaskCommand(user.UserName, task);
            await Mediator.Send(deleteTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Shares the task with other user.
        ///</summary>
        ///<response code="204">Task deleted successfully.</response>
        ///<response code="400">The task is shared already.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="404">User to share with not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("{id}/share/{username}")]
        public async Task<ActionResult> ShareTask(Guid id, string username)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return NotFound("Task not found");

            var loggedUserQuery = new LoggedUserQuery();
            User loggedUser = await Mediator.Send(loggedUserQuery);

            var getUserQuery = new GetUserQuery(username);
            User sharedWithUser = await Mediator.Send(getUserQuery);

            if (sharedWithUser == null)
                return NotFound("User to share the task with not found.");
            else if (task.UserTask.SharedWithId != null)
                return BadRequest("The task is shared already.");

            var shareTaskCommand = new ShareTaskCommand(task, loggedUser.Id, sharedWithUser);
            await Mediator.Send(shareTaskCommand);

            return NoContent();
        }

        ///<summary>
        /// Accepts shared task.
        ///</summary>
        ///<response code="204">Task accepted.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("accept/{id}")]
        public async Task<ActionResult> AcceptTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return NotFound("Task not found");

            var acceptTask = new AcceptTaskCommand(task);
            await Mediator.Send(acceptTask);

            return NoContent();
        }

        ///<summary>
        /// Refuses shared task.
        ///</summary>
        ///<response code="204">Task refused.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("refuse/{id}")]
        public async Task<ActionResult> RefuseTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return NotFound("Task not found");

            var refuseTask = new RefuseTaskCommand(task);
            await Mediator.Send(refuseTask);

            return NoContent();
        }

        ///<summary>
        /// Closes shared task.
        ///</summary>
        ///<response code="204">Task closed successfully.</response>
        ///<response code="404">Task not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPost("finish/{id}")]
        public async Task<ActionResult> FinishTask(Guid id)
        {
            var taskDetailsQuery = new TaskDetailsQuery(id);
            var task = await Mediator.Send(taskDetailsQuery);

            if (task == null)
                return NotFound("Task not found");

            var finishTask = new FinishTaskCommand(task);
            await Mediator.Send(finishTask);

            return NoContent();
        }
    }
}
