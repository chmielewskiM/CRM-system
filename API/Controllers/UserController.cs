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

    public class UserController : BaseController
    {

        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> RegisterUser(RegisterUser.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<AppUser>> LoggedUser()
        {
            return await Mediator.Send(new LoggedUser.Query());
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<AppUser>> GetUser(String username)
        {
            return await Mediator.Send(new GetUser.Query { Username = username });
        }

        [HttpGet("list")]
        public async Task<ActionResult<List<User>>> List(CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(string id, EditUser.Command command)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{username}")]
        public async Task<ActionResult<Unit>> DeleteUser(string username)
        {
            return await _mediator.Send(new DeleteUser.Command { Username = username });
        }
    }
}