using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Entities;

namespace SmartOfferSlotBooking.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(ApplicationDbContext db)
    {
        if (await db.Users.AnyAsync()) return;

        var admin = new User
        {
            Email = "admin@smartoffer.demo",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRoles.Admin
        };
        db.Users.Add(admin);
        await db.SaveChangesAsync();

        var business = new Business
        {
            UserId = admin.Id,
            BusinessName = "ZenFit Wellness Studio",
            BusinessType = nameof(BusinessType.Gym),
            OwnerName = "Priya Sharma",
            PhoneNumber = "+91-9876543210",
            Email = "contact@zenfit.demo",
            Address = "42 MG Road, Koramangala",
            City = "Bangalore",
            LogoUrl = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200",
            OpeningTime = new TimeSpan(6, 0, 0),
            ClosingTime = new TimeSpan(22, 0, 0)
        };
        db.Businesses.Add(business);
        await db.SaveChangesAsync();

        var offers = new List<Offer>
        {
            new()
            {
                BusinessId = business.Id,
                Title = "Morning Yoga Blast — 50% Off",
                Description = "Start your day with energizing vinyasa flow. Limited slots for new members.",
                Category = "Fitness",
                OriginalPrice = 1200,
                OfferPrice = 599,
                DiscountPercentage = 50.08m,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-2)),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14)),
                StartTime = new TimeSpan(6, 0, 0),
                EndTime = new TimeSpan(10, 0, 0),
                TotalCapacity = 40,
                MaxBookingPerCustomer = 2,
                TermsAndConditions = "Valid for first-time customers. Arrive 10 minutes early.",
                Status = nameof(OfferStatus.Active)
            },
            new()
            {
                BusinessId = business.Id,
                Title = "HIIT Power Hour Weekend",
                Description = "High-intensity interval training with certified coaches.",
                Category = "Fitness",
                OriginalPrice = 1500,
                OfferPrice = 899,
                DiscountPercentage = 40.07m,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
                StartTime = new TimeSpan(17, 0, 0),
                EndTime = new TimeSpan(20, 0, 0),
                TotalCapacity = 30,
                MaxBookingPerCustomer = 3,
                TermsAndConditions = "Bring your own water bottle. No refunds within 24h.",
                Status = nameof(OfferStatus.Active)
            },
            new()
            {
                BusinessId = business.Id,
                Title = "Spa Recovery Package",
                Description = "Sauna + massage combo for post-workout recovery.",
                Category = "Wellness",
                OriginalPrice = 3500,
                OfferPrice = 2499,
                DiscountPercentage = 28.6m,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(45)),
                StartTime = new TimeSpan(11, 0, 0),
                EndTime = new TimeSpan(19, 0, 0),
                TotalCapacity = 15,
                MaxBookingPerCustomer = 1,
                Status = nameof(OfferStatus.Draft)
            }
        };
        db.Offers.AddRange(offers);
        await db.SaveChangesAsync();

        foreach (var offer in offers.Where(o => o.Status == nameof(OfferStatus.Active)))
        {
            for (var d = 0; d < 7; d++)
            {
                var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(d));
                db.OfferSlots.Add(new OfferSlot
                {
                    OfferId = offer.Id,
                    SlotDate = date,
                    StartTime = offer.StartTime,
                    EndTime = offer.StartTime.Add(TimeSpan.FromHours(1)),
                    Capacity = 8,
                    BookedCount = d == 0 ? 2 : 0,
                    Status = d == 0 ? nameof(SlotStatus.Available) : nameof(SlotStatus.Available)
                });
                db.OfferSlots.Add(new OfferSlot
                {
                    OfferId = offer.Id,
                    SlotDate = date,
                    StartTime = offer.StartTime.Add(TimeSpan.FromHours(2)),
                    EndTime = offer.StartTime.Add(TimeSpan.FromHours(3)),
                    Capacity = 6,
                    BookedCount = 0,
                    Status = nameof(SlotStatus.Available)
                });
            }
        }
        await db.SaveChangesAsync();

        db.Coupons.AddRange(
            new Coupon { OfferId = offers[0].Id, Code = "ZENFIT50", DiscountPercent = 10, MaxUses = 50, ValidFrom = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)), ValidTo = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)) },
            new Coupon { Code = "WELCOME100", DiscountAmount = 100, MaxUses = 200, ValidFrom = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)), ValidTo = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(60)) }
        );
        await db.SaveChangesAsync();
    }

    public static async Task EnsureDemoUsersAsync(ApplicationDbContext db)
    {
        if (!await db.Users.AnyAsync(u => u.Email == "customer@smartoffer.demo"))
        {
            db.Users.Add(new User
            {
                Email = "customer@smartoffer.demo",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
                Role = UserRoles.Customer,
                FullName = "Rahul Verma",
                PhoneNumber = "+91-9123456780"
            });
            await db.SaveChangesAsync();
        }
    }
}
