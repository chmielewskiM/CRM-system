using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly DataContext _context;

        public ContactController(DataContext context)
        {
            _context = context;
        }
        //GET contact
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> Get()
        {
            var contact = await _context.Contacts.ToListAsync();
            return Ok(contact);
        }
        //GET contact/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> Get(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            return Ok(contact);
        }
    }
}
