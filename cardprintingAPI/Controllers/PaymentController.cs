using cardprintingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cardprintingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly CardPrintingDbContext _context;
        public PaymentController(CardPrintingDbContext context)
        {
            _context = context;
        }
        // GET: api/Payment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return await _context.Payments.Include(p => p.User).ToListAsync();
        }

        // GET: api/Payment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            return payment;
        }
        // Replace the PostPayment method to avoid variable shadowing and fix CS0136
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            var newPayment = new Payment
            {
                UserId = payment.UserId,
                AcountNumber = payment.AcountNumber,
                CvvNumber = payment.CvvNumber,
                CardExpiryDate = payment.CardExpiryDate,
                Amount = payment.Amount,
                PaymentDate = payment.PaymentDate
            };

            _context.Payments.Add(newPayment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = newPayment.PaymentId }, newPayment);
        }

        // PUT: api/Payment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.PaymentId)
            {
                return BadRequest();
            }
            _context.Entry(payment).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        private bool PaymentExists(int id)
        {
            throw new NotImplementedException();
        }

        // DELETE: api/Payment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
