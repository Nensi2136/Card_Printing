using cardprintingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cardprintingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactUController : ControllerBase
    {
        private readonly CardPrintingDbContext _context;
        public ContactUController(CardPrintingDbContext context)
        {
            _context = context;
        }
        // POST: api/ContactU
        [HttpPost]
        public async Task<ActionResult<ContactU>> PostContactU(ContactU contactU)
        {
            contactU.CreatedAt = DateTime.Now;
            _context.ContactUs.Add(contactU);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetContactU), new { id = contactU.ContactId }, contactU);
        }
        // GET: api/ContactU/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactU>> GetContactU(int id)
        {
            var contactU = await _context.ContactUs.FindAsync(id);
            if (contactU == null)
            {
                return NotFound();
            }
            return contactU;
        }
        // GET: api/ContactU
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactU>>> GetContactUs()
        {
            return await _context.ContactUs.Include(c => c.User).ToListAsync();
        }
        // PUT: api/ContactU/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContactU(int id, ContactU contactU)
        {
            if (id != contactU.ContactId)
            {
                return BadRequest();
            }
            _context.Entry(contactU).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactUExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        private bool ContactUExists(int id)
        {
            throw new NotImplementedException();
        }

        // DELETE: api/ContactU/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactU(int id)
        {
            var contactU = await _context.ContactUs.FindAsync(id);
            if (contactU == null)
            {
                return NotFound();
            }
            _context.ContactUs.Remove(contactU);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
