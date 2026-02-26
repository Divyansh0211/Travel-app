using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TravelSocialApp.Models;

namespace TravelSocialApp.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Story> Stories { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<SavedPlace> SavedPlaces { get; set; }
        public DbSet<Follow> Follows { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // MongoDB EF Core requirements: Primary keys must be mapped to _id
            builder.Entity<UserProfile>().Property(p => p.UserId).HasElementName("_id");
            
            // Map Identity types if needed, though provider might handle base ones
            // But custom ones like UserProfile definitely need it
        }
    }
}
