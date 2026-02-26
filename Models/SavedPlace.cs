using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TravelSocialApp.Models
{
    public class SavedPlace
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = default!;
        public IdentityUser? User { get; set; }
        
        [Required]
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    }
}
