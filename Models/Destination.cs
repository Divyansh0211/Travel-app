using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelSocialApp.Models
{
    public class Destination
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        [Required]
        public string Description { get; set; } = default!;

        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }
    }
}
