using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cardprintingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly Models.CardPrintingDbContext _context;
        public ReviewController(Models.CardPrintingDbContext context)
        {
            _context = context;
        }
        // GET: api/Review
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Review>>> GetReviews()
        {
            return await _context.Reviews.ToListAsync();
        }
        // GET: api/Review/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Review>> GetReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }
            return review;
        }
        // POST: api/Review
        [HttpPost]
        public async Task<ActionResult<Models.Review>> PostReview(Models.Review review)
        {
            review.CreatedAt = DateTime.Now;
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReview), new { id = review.ReviewId }, review);
        }
        // PUT: api/Review/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, [FromBody] Models.Review review)
        {
            if (review == null)
                return BadRequest("Review cannot be null.");
            try
            {
                var existingReview = await _context.Reviews.FindAsync(id);
                if (existingReview == null)
                    return NotFound();
                existingReview.Rating = review.Rating;
                existingReview.Comment = review.Comment;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        // DELETE: api/Review/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
