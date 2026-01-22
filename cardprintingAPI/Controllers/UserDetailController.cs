using cardprintingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cardprintingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDetailController : ControllerBase
    {
        private readonly CardPrintingDbContext _context;
        public UserDetailController(CardPrintingDbContext context)
        {
            _context = context;
        }

        // GET: api/UserDetail
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDetail>>> GetUserDetails()
        {
            return await _context.UserDetails.ToListAsync();
        }

        // GET: api/UserDetail/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDetail>> GetUserDetail(int id)
        {
            var userDetail = await _context.UserDetails.FindAsync(id);
            if (userDetail == null)
            {
                return NotFound();
            }
            return userDetail;
        }

        // POST: api/UserDetail
        [HttpPost]
        public async Task<ActionResult<UserDetail>> PostUserDetail(UserDetail userDetail)
        {
            userDetail.CreatedAt = DateTime.Now;
            _context.UserDetails.Add(userDetail);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserDetail), new { id = userDetail.UserId }, userDetail);
        }

        // Update city

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserDetail(int id, [FromBody] UserDetail userDetail)
        {
            if (userDetail == null)
                return BadRequest("User detail cannot be null.");

            try
            {
                var existingUserDetail = await _context.UserDetails.FindAsync(id);
                if (existingUserDetail == null)
                    return NotFound();

                // Use ID from route
                userDetail.UserId = id;

                existingUserDetail.Username = userDetail.Username;
                existingUserDetail.Email = userDetail.Email;
                existingUserDetail.PasswordHash = userDetail.PasswordHash;
                existingUserDetail.IsPremium = userDetail.IsPremium;
                existingUserDetail.IsAdmin = userDetail.IsAdmin;
                existingUserDetail.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        //delete user by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.UserDetails.FindAsync(id);
                if (user == null)
                    return NotFound($"User with ID {id} not found.");

                _context.UserDetails.Remove(user);
                await _context.SaveChangesAsync();
                return NoContent(); // HTTP 204
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
