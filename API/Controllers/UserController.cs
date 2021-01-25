using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.AppUser;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading;
using Domain;
using System;

namespace API.Controllers
{

    public class UserController : BaseController
    {
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }
        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(Register.Command command)
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
    }
}