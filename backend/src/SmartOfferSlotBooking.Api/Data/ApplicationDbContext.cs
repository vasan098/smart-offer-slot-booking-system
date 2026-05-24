using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Entities;

namespace SmartOfferSlotBooking.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<OfferSlot> OfferSlots => Set<OfferSlot>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<WaitlistEntry> WaitlistEntries => Set<WaitlistEntry>();
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.Role).HasMaxLength(32);
            e.Property(x => x.FullName).HasColumnName("full_name").HasMaxLength(150);
            e.Property(x => x.PhoneNumber).HasColumnName("phone_number").HasMaxLength(20);
        });

        modelBuilder.Entity<Business>(e =>
        {
            e.HasOne(x => x.User).WithOne(x => x.Business).HasForeignKey<Business>(x => x.UserId);
            e.HasIndex(x => x.BusinessType);
            e.HasIndex(x => x.City);
        });

        modelBuilder.Entity<Offer>(e =>
        {
            e.HasOne(x => x.Business).WithMany(x => x.Offers).HasForeignKey(x => x.BusinessId);
            e.HasIndex(x => x.Status);
            e.HasIndex(x => x.Category);
            e.Property(x => x.OriginalPrice).HasPrecision(12, 2);
            e.Property(x => x.OfferPrice).HasPrecision(12, 2);
            e.Property(x => x.DiscountPercentage).HasPrecision(5, 2);
        });

        modelBuilder.Entity<OfferSlot>(e =>
        {
            e.HasOne(x => x.Offer).WithMany(x => x.Slots).HasForeignKey(x => x.OfferId);
            e.Ignore(x => x.AvailableCount);
            e.HasIndex(x => x.SlotDate);
            e.HasIndex(x => x.Status);
        });

        modelBuilder.Entity<Booking>(e =>
        {
            e.Property(x => x.UserId).HasColumnName("user_id");
            e.HasOne(x => x.User).WithMany(x => x.Bookings).HasForeignKey(x => x.UserId).IsRequired(false);
            e.HasOne(x => x.Offer).WithMany(x => x.Bookings).HasForeignKey(x => x.OfferId);
            e.HasOne(x => x.Slot).WithMany(x => x.Bookings).HasForeignKey(x => x.SlotId);
            e.HasIndex(x => x.Reference).IsUnique();
            e.HasIndex(x => x.PhoneNumber);
            e.HasIndex(x => x.Status);
        });

        modelBuilder.Entity<Coupon>(e =>
        {
            e.HasIndex(x => x.Code).IsUnique();
            e.Property(x => x.DiscountAmount).HasPrecision(12, 2);
            e.Property(x => x.DiscountPercent).HasPrecision(5, 2);
        });

        modelBuilder.Entity<WaitlistEntry>(e =>
        {
            e.HasOne(x => x.Slot).WithMany(x => x.WaitlistEntries).HasForeignKey(x => x.SlotId);
        });

        modelBuilder.Entity<NotificationLog>(e =>
        {
            e.HasOne(x => x.Booking).WithMany(x => x.NotificationLogs).HasForeignKey(x => x.BookingId);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
