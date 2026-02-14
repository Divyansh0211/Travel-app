using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TravelSocialApp.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = default!;
        public IdentityUser? User { get; set; }

        [Required]
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }

        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        [Required]
        [DataType(DataType.Date)]
        public DateTime TravelDate { get; set; }
    }
}
