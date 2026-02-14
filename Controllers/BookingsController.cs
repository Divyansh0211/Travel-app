using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using TravelSocialApp.Data;
using TravelSocialApp.Models;

namespace TravelSocialApp.Controllers
{
    [Authorize]
    public class BookingsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public BookingsController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Bookings/MyBookings
        public async Task<IActionResult> MyBookings()
        {
            var userId = _userManager.GetUserId(User);
            var bookings = await _context.Bookings
                .Include(b => b.Destination)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
            return View(bookings);
        }

        // GET: Bookings/Create?destinationId=5
        public async Task<IActionResult> Create(int? destinationId)
        {
            if (destinationId == null)
            {
                // If no destination selected, maybe redirect or show list?
                // For now, let's just populate the dropdown.
                ViewData["DestinationId"] = new SelectList(_context.Destinations, "Id", "Name");
                return View();
            }

            var destination = await _context.Destinations.FindAsync(destinationId);
            if (destination == null)
            {
                return NotFound();
            }

            ViewData["DestinationName"] = destination.Name;
            
            var booking = new Booking
            {
                DestinationId = destinationId.Value,
                TravelDate = DateTime.Today.AddDays(7) // Default to next week
            };

            return View(booking);
        }

        // POST: Bookings/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("DestinationId,TravelDate")] Booking booking)
        {
            ModelState.Remove("UserId");
            ModelState.Remove("User");
            ModelState.Remove("Destination");

            if (ModelState.IsValid)
            {
                booking.UserId = _userManager.GetUserId(User) ?? throw new InvalidOperationException("User ID not found");
                booking.BookingDate = DateTime.UtcNow;
                _context.Add(booking);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(MyBookings));
            }
            
            // Reload destination name for view if validation fails
            var destination = await _context.Destinations.FindAsync(booking.DestinationId);
            ViewData["DestinationName"] = destination?.Name;
             
            return View(booking);
        }
    }
}
