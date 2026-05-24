using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;
using SmartOfferSlotBooking.Api.Utils;

namespace SmartOfferSlotBooking.Api.Services;

public class SlotService : ISlotService
{
    private readonly ApplicationDbContext _db;

    public SlotService(ApplicationDbContext db) => _db = db;

    public async Task<List<SlotDto>> GetByOfferIdAsync(Guid offerId, CancellationToken ct = default)
    {
        var slots = await _db.OfferSlots.Where(s => s.OfferId == offerId).OrderBy(s => s.SlotDate).ThenBy(s => s.StartTime).ToListAsync(ct);
        return slots.Select(Map).ToList();
    }

    public async Task<List<SlotDto>> GetAllAsync(Guid? offerId, CancellationToken ct = default)
    {
        var query = _db.OfferSlots.AsQueryable();
        if (offerId.HasValue) query = query.Where(s => s.OfferId == offerId);
        var slots = await query.OrderBy(s => s.SlotDate).ToListAsync(ct);
        return slots.Select(Map).ToList();
    }

    public async Task<SlotDto> CreateAsync(Guid businessId, CreateSlotRequest request, CancellationToken ct = default)
    {
        await EnsureOfferOwnership(businessId, request.OfferId, ct);
        var slot = new OfferSlot
        {
            OfferId = request.OfferId,
            SlotDate = TimeParser.ParseDate(request.SlotDate),
            StartTime = TimeParser.ParseTime(request.StartTime),
            EndTime = TimeParser.ParseTime(request.EndTime),
            Capacity = request.Capacity,
            Status = request.Status
        };
        UpdateSlotStatus(slot);
        _db.OfferSlots.Add(slot);
        await _db.SaveChangesAsync(ct);
        return Map(slot);
    }

    public async Task<SlotDto> UpdateAsync(Guid businessId, Guid id, UpdateSlotRequest request, CancellationToken ct = default)
    {
        var slot = await _db.OfferSlots.Include(s => s.Offer).FirstOrDefaultAsync(s => s.Id == id, ct)
            ?? throw new KeyNotFoundException("Slot not found.");
        if (slot.Offer.BusinessId != businessId) throw new UnauthorizedAccessException();

        slot.SlotDate = TimeParser.ParseDate(request.SlotDate);
        slot.StartTime = TimeParser.ParseTime(request.StartTime);
        slot.EndTime = TimeParser.ParseTime(request.EndTime);
        slot.Capacity = request.Capacity;
        slot.Status = request.Status;
        slot.UpdatedAt = DateTime.UtcNow;
        UpdateSlotStatus(slot);
        await _db.SaveChangesAsync(ct);
        return Map(slot);
    }

    public async Task DeleteAsync(Guid businessId, Guid id, CancellationToken ct = default)
    {
        var slot = await _db.OfferSlots.Include(s => s.Offer).FirstOrDefaultAsync(s => s.Id == id, ct)
            ?? throw new KeyNotFoundException("Slot not found.");
        if (slot.Offer.BusinessId != businessId) throw new UnauthorizedAccessException();
        _db.OfferSlots.Remove(slot);
        await _db.SaveChangesAsync(ct);
    }

    public static void UpdateSlotStatus(OfferSlot slot)
    {
        if (slot.Status == nameof(SlotStatus.Cancelled)) return;
        if (slot.SlotDate < DateOnly.FromDateTime(DateTime.UtcNow))
            slot.Status = nameof(SlotStatus.Expired);
        else if (slot.BookedCount >= slot.Capacity)
            slot.Status = nameof(SlotStatus.Full);
        else
            slot.Status = nameof(SlotStatus.Available);
    }

    private async Task EnsureOfferOwnership(Guid businessId, Guid offerId, CancellationToken ct)
    {
        if (!await _db.Offers.AnyAsync(o => o.Id == offerId && o.BusinessId == businessId, ct))
            throw new KeyNotFoundException("Offer not found.");
    }

    private static SlotDto Map(OfferSlot s) => new(
        s.Id, s.OfferId, TimeParser.FormatDate(s.SlotDate), TimeParser.FormatTime(s.StartTime),
        TimeParser.FormatTime(s.EndTime), s.Capacity, s.BookedCount, s.AvailableCount, s.Status);
}
