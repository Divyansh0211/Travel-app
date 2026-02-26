using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelSocialApp.Data;
using TravelSocialApp.Models;

namespace TravelSocialApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SocialController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public SocialController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // --- SAVED PLACES ---
        [HttpGet("saved")]
        public async Task<ActionResult<IEnumerable<SavedPlace>>> GetSavedPlaces()
        {
            var userId = _userManager.GetUserId(User);
            return await _context.SavedPlaces
                .Include(s => s.Destination)
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        [HttpPost("save/{destinationId}")]
        public async Task<IActionResult> SavePlace(int destinationId)
        {
            var userId = _userManager.GetUserId(User);
            if (await _context.SavedPlaces.AnyAsync(s => s.UserId == userId && s.DestinationId == destinationId))
                return BadRequest("Already saved");

            _context.SavedPlaces.Add(new SavedPlace { UserId = userId!, DestinationId = destinationId });
            await _context.SaveChangesAsync();
            return Ok();
        }

        // --- FOLLOWS ---
        [HttpPost("follow/{targetUserId}")]
        public async Task<IActionResult> FollowUser(string targetUserId)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == targetUserId) return BadRequest("Can't follow yourself");

            if (await _context.Follows.AnyAsync(f => f.FollowerId == userId && f.FollowingId == targetUserId))
                return BadRequest("Already following");

            _context.Follows.Add(new Follow { FollowerId = userId!, FollowingId = targetUserId });
            await _context.SaveChangesAsync();
            return Ok();
        }

        // --- REVIEWS ---
        [HttpPost("review")]
        public async Task<IActionResult> PostReview([FromBody] Review review)
        {
            var userId = _userManager.GetUserId(User);
            review.UserId = userId!;
            review.CreatedAt = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("reviews/{destinationId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(int destinationId)
        {
            return await _context.Reviews
                .Where(r => r.DestinationId == destinationId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }
    }
}
