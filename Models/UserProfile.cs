using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TravelSocialApp.Models
{
    public class UserProfile
    {
        [Key]
        public string UserId { get; set; } = default!;
        public string? FullName { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public List<string>? Interests { get; set; } = new();
        public bool IsVerified { get; set; } = false;
        
        // Navigation
        public IdentityUser? User { get; set; }
    }
}
