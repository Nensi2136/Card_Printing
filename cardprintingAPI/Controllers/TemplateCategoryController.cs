using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cardprintingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplateCategoryController : ControllerBase
    {
        private readonly Models.CardPrintingDbContext _context;
        public TemplateCategoryController(Models.CardPrintingDbContext context)
        {
            _context = context;
        }
        // GET: api/TemplateCategory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.TemplateCategory>>> GetTemplateCategories()
        {
            return await _context.TemplateCategories.ToListAsync();
        }
        // GET: api/TemplateCategory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.TemplateCategory>> GetTemplateCategory(int id)
        {
            var templateCategory = await _context.TemplateCategories.FindAsync(id);
            if (templateCategory == null)
            {
                return NotFound();
            }
            return templateCategory;
        }
        // POST: api/TemplateCategory
        [HttpPost]
        public async Task<ActionResult<Models.TemplateCategory>> PostTemplateCategory([FromBody] dynamic request)
        {
            try
            {
                var now = DateTime.Now;
                var templateCategory = new Models.TemplateCategory
                {
                    CategoryName = request.CategoryName?.ToString() ?? "",
                    CategoryDescription = request.CategoryDescription?.ToString(),
                    CreatedAt = now,
                    UpdatedAt = now
                };
                
                _context.TemplateCategories.Add(templateCategory);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTemplateCategory), new { id = templateCategory.CategoryId }, templateCategory);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating category: {ex.Message}");
            }
        }
        // PUT: api/TemplateCategory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTemplateCategory(int id, [FromBody] Models.TemplateCategory templateCategory)
        {
            if (templateCategory == null)
                return BadRequest("Template category cannot be null.");
            try
            {
                var existingTemplateCategory = await _context.TemplateCategories.FindAsync(id);
                if (existingTemplateCategory == null)
                    return NotFound();
                existingTemplateCategory.CategoryName = templateCategory.CategoryName;
                existingTemplateCategory.CategoryDescription = templateCategory.CategoryDescription;
                existingTemplateCategory.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        // DELETE: api/TemplateCategory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplateCategory(int id)
        {
            var templateCategory = await _context.TemplateCategories.FindAsync(id);
            if (templateCategory == null)
            {
                return NotFound();
            }
            _context.TemplateCategories.Remove(templateCategory);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
