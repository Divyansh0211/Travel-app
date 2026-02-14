using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TravelSocialApp.Models
{
    public class Story
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = default!;
        public IdentityUser? User { get; set; }

        [Required]
        public string Content { get; set; } = default!;

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
