using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.AppUser;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading;
using Domain;
using System;
using MediatR;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    // [Produces("application/json")]
    public class UsersController : BaseController
    {
        ///<summary>
        /// Return list with users.
        ///</summary>
        ///<response code="200">Returns list with users.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<List<User>>> ListUsers(CancellationToken ct)
        {
            return await Mediator.Send(new ListUsers.Query(), ct);
        }

        ///<summary>
        /// Returns logged user.
        ///</summary>
        ///<response code="200">Returns logged user.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("logged")]
        public async Task<ActionResult<AppUser>> LoggedUser()
        {
            return await Mediator.Send(new LoggedUser.Query());
        }

        ///<summary>
        /// Returns an user.
        ///</summary>
        ///<response code="200">Returns an user.</response>
        ///<response code="404">User not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("user/{username}")]
        public async Task<ActionResult<AppUser>> GetUser(String username)
        {
            return await Mediator.Send(new GetUser.Query { Username = username });
        }

        ///<summary>
        /// Logs user in.
        ///</summary>
        ///<response code="200">User logged in.</response>
        ///<response code="401">User unauthorized.</response>
        ///<response code="500">Server error.</response>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        ///<summary>
        /// Registers an user.
        ///</summary>
        ///<response code="200">Registers an user.</response>
        ///<response code="400">Username/email already exists.</response>
        ///<response code="500">Problem creating user.</response>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> RegisterUser(RegisterUser.Command command)
        {
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Updates an user.
        ///</summary>
        ///<response code="200">User updated.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">User not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("update/{id}")]
        public async Task<ActionResult<Unit>> EditUser(string id, EditUser.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        ///<summary>
        /// Deletes an user.
        ///</summary>
        ///<response code="200">User deleted successfully.</response>
        ///<response code="500">Failed to delete user.</response>
        [HttpDelete("{username}")]
        public async Task<ActionResult<Unit>> DeleteUser(string username)
        {
            return await Mediator.Send(new DeleteUser.Command { Username = username });
        }
    }
}