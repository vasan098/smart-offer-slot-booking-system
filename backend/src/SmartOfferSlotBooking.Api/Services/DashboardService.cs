using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;

namespace SmartOfferSlotBooking.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _db;
    private readonly IBookingService _bookings;

    public DashboardService(ApplicationDbContext db, IBookingService bookings)
    {
        _db = db;
        _bookings = bookings;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync(Guid businessId, CancellationToken ct = default)
    {
        var offers = await _db.Offers.Where(o => o.BusinessId == businessId).Include(o => o.Slots).ToListAsync(ct);
        var offerIds = offers.Select(o => o.Id).ToList();
        var bookings = await _db.Bookings.Include(b => b.Offer).Include(b => b.Slot)
            .Where(b => offerIds.Contains(b.OfferId)).ToListAsync(ct);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var totalCapacity = offers.SelectMany(o => o.Slots).Sum(s => s.Capacity);
        var bookedSeats = offers.SelectMany(o => o.Slots).Sum(s => s.BookedCount);
        var views = offers.Count * 10; // simulated views for conversion
        var conversion = views > 0 ? Math.Round((decimal)bookings.Count / views * 100, 2) : 0;

        var recent = await _bookings.GetAllAsync(businessId, ct);
        var statusStats = bookings.GroupBy(b => b.Status).ToDictionary(g => g.Key, g => g.Count());

        var performance = bookings.GroupBy(b => b.OfferId).Select(g =>
        {
            var offer = offers.First(o => o.Id == g.Key);
            return new OfferPerformanceDto(offer.Title, g.Count(), g.Count() * offer.OfferPrice);
        }).ToList();

        return new DashboardSummaryDto(
            offers.Count,
            offers.Count(o => o.Status == nameof(OfferStatus.Active)),
            bookings.Count,
            bookings.Count(b => b.Slot.SlotDate == today),
            totalCapacity,
            bookedSeats,
            totalCapacity - bookedSeats,
            conversion,
            recent.Take(10).ToList(),
            statusStats,
            performance);
    }
}
