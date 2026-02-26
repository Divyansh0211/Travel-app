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
    public class StoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public StoriesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Stories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Story>>> GetStories()
        {
            return await _context.Stories
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        // POST: api/Stories
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Story>> PostStory([FromBody] Story story)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            story.UserId = userId;
            story.CreatedAt = DateTime.UtcNow;

            _context.Stories.Add(story);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStories), new { id = story.Id }, story);
        }
    }
}
