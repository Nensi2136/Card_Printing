using cardprintingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cardprintingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardTemplateController : ControllerBase
    {
        private readonly CardPrintingDbContext _context;
        public CardTemplateController(CardPrintingDbContext context)
        {
            _context = context;
        }
        // GET: api/CardTemplate
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CardTemplate>>> GetCardTemplates()
        {
            return await _context.CardTemplates.Include(ct => ct.Category).ToListAsync();
        }
        // GET: api/CardTemplate/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CardTemplate>> GetCardTemplate(int id)
        {
            var cardTemplate = await _context.CardTemplates.Include(ct => ct.Category).FirstOrDefaultAsync(ct => ct.TemplateId == id);
            if (cardTemplate == null)
            {
                return NotFound();
            }
            return cardTemplate;
        }
        // Replace the parameter name in the PostCardTemplate method to avoid shadowing
        [HttpPost]
        public async Task<ActionResult<CardTemplate>> PostCardTemplate(CardTemplate dto)
        {
            var cardTemplate = new CardTemplate
            {
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                CardTemplateDescription = dto.CardTemplateDescription,
                FilePath = dto.FilePath,
                IsPremium = dto.IsPremium,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.CardTemplates.Add(cardTemplate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCardTemplate), new { id = cardTemplate.TemplateId }, cardTemplate);
        }
        // PUT: api/CardTemplate/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCardTemplate(int id, CardTemplate cardTemplate)
        {
            if (id != cardTemplate.TemplateId)
            {
                return BadRequest();
            }
            cardTemplate.UpdatedAt = DateTime.Now;
            _context.Entry(cardTemplate).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardTemplateExists(id))
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
        private bool CardTemplateExists(int id)
        {
            return _context.CardTemplates.Any(e => e.TemplateId == id);
        }
        // DELETE: api/CardTemplate/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCardTemplate(int id)
        {
            var cardTemplate = await _context.CardTemplates.FindAsync(id);
            if (cardTemplate == null)
            {
                return NotFound();
            }
            _context.CardTemplates.Remove(cardTemplate);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
