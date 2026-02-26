using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TravelSocialApp.Models
{
    public class Follow
    {
        public int Id { get; set; }
        
        [Required]
        public string FollowerId { get; set; } = default!; // The user who is following
        public IdentityUser? Follower { get; set; }
        
        [Required]
        public string FollowingId { get; set; } = default!; // The user being followed
        public IdentityUser? Following { get; set; }
        
        public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    }
}
