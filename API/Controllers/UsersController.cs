using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading;
using Domain;
using System;
using MediatR;
using Application.Users.ViewModels;
using Application.Users;
using Application.Users.Queries;
using Application.Users.Commands;
using Application.Validators;

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
        ///<response code="204">Returns list with users.</response>
        ///<response code="500">Server error.</response>
        [HttpGet]
        public async Task<ActionResult<List<UserViewModel>>> ListUsers(CancellationToken ct)
        {
            var usersListQuery = new ListUsersQuery();
            var usersList = await Mediator.Send(usersListQuery);

            // if (data == null)
            //     return BadRequest("User not found");

            return Mapper.Map<List<User>, List<UserViewModel>>(usersList);
        }

        ///<summary>
        /// Returns logged user.
        ///</summary>
        ///<response code="204">Returns logged user.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("logged")]
        public async Task<ActionResult<UserViewModel>> LoggedUser()
        {
            var loggedUserQuery = new LoggedUserQuery();
            var user = await Mediator.Send(loggedUserQuery);

            if (user == null)
                return BadRequest("User not found");

            return Mapper.Map<User, UserViewModel>(user);
        }

        ///<summary>
        /// Returns an user.
        ///</summary>
        ///<response code="204">Returns an user.</response>
        ///<response code="404">User not found.</response>
        ///<response code="500">Server error.</response>
        [HttpGet("user/{username}")]
        public async Task<ActionResult<UserViewModel>> GetUser(String username)
        {
            var getUserQuery = new GetUserQuery();
            getUserQuery.Username = username;
            var user = await Mediator.Send(getUserQuery);

            if (user == null)
                return BadRequest("User not found");

            return Mapper.Map<User, UserViewModel>(user);
        }

        ///<summary>
        /// Logs user in.
        ///</summary>
        ///<response code="204">User logged in.</response>
        ///<response code="401">User unauthorized.</response>
        ///<response code="500">Server error.</response>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserViewModel>> Login(UserViewModel user)
        {
            var notFound = await GetUser(user.Username) == null;
            if (notFound)
                return BadRequest("User not found");

            var loginUserQuery = new LoginUserQuery();
            loginUserQuery.Username = user.Username;
            loginUserQuery.Password = user.Password;
            var loggedUser = await Mediator.Send(loginUserQuery);

            return loggedUser;
        }

        ///<summary>
        /// Registers an user.
        ///</summary>
        ///<response code="204">Registers an user.</response>
        ///<response code="400">Username/email already exists.</response>
        ///<response code="500">Problem creating user.</response>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(UserViewModel user)
        {
            RegisterUserValidator ruleSet = new RegisterUserValidator();
            var validationResult = await filterValidationFailures(ruleSet, user);
            if (validationResult != NoContent())
                return validationResult;

            var userExists = await GetUser(user.Username) != null;
            if (userExists)
                return BadRequest("This username is taken already.");

            var registerUserCommand = new RegisterUserCommand(user.Username, user.DisplayName, user.Password, user.Email, user.Level);
            await Mediator.Send(registerUserCommand);

            return NoContent();
        }

        ///<summary>
        /// Updates an user.
        ///</summary>
        ///<response code="204">User updated.</response>
        ///<response code="304">There were no changes.</response>
        ///<response code="404">User not found.</response>
        ///<response code="500">Problem saving changes.</response>
        [HttpPut("update/{id}")]
        public async Task<ActionResult> EditUser(UserViewModel user)
        {
            var notFound = await GetUser(user.Username) == null;
            if (notFound)
                return BadRequest("User not found");

            var editUserCommand = new EditUserCommand(user.Id, user.DisplayName, user.Username, user.Email, user.Password, user.Level);
            await Mediator.Send(editUserCommand);

            return NoContent();
        }

        ///<summary>
        /// Deletes an user.
        ///</summary>
        ///<response code="204">User deleted successfully.</response>
        ///<response code="500">Failed to delete user.</response>
        [HttpDelete("{username}")]
        public async Task<ActionResult> DeleteUser(string username)
        {
            var getUserQuery = new GetUserQuery();
            getUserQuery.Username = username;
            var user = await Mediator.Send(getUserQuery);

            if (user == null)
                return BadRequest("User not found");

            var deleteUserCommand = new DeleteUserCommand(username);
            await Mediator.Send(deleteUserCommand);

            return NoContent();
        }
    }
}