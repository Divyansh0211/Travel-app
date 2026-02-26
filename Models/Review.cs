using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TravelSocialApp.Models
{
    public class Review
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = default!;
        public IdentityUser? User { get; set; }
        
        [Required]
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [Required]
        public string Comment { get; set; } = default!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
