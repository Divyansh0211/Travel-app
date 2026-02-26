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
    public class ProfilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public ProfilesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Profiles/me
        [HttpGet("me")]
        public async Task<ActionResult<UserProfile>> GetMyProfile()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var profile = await _context.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                // Create initial profile if it doesn't exist
                profile = new UserProfile { UserId = userId, FullName = User.Identity?.Name };
                _context.UserProfiles.Add(profile);
                await _context.SaveChangesAsync();
            }

            return profile;
        }

        // PUT: api/Profiles/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfile updatedProfile)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return NotFound();

            profile.FullName = updatedProfile.FullName;
            profile.Bio = updatedProfile.Bio;
            profile.ProfilePictureUrl = updatedProfile.ProfilePictureUrl;
            profile.Interests = updatedProfile.Interests;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/Profiles/5
        [HttpGet("{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfile>> GetProfile(string userId)
        {
            var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return NotFound();
            return profile;
        }
    }
}
