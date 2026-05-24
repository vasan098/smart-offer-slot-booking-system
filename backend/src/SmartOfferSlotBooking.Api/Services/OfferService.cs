using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;
using SmartOfferSlotBooking.Api.Utils;

namespace SmartOfferSlotBooking.Api.Services;

public class OfferService : IOfferService
{
    private readonly ApplicationDbContext _db;

    public OfferService(ApplicationDbContext db) => _db = db;

    public async Task<List<OfferDto>> GetOffersAsync(OfferFilterQuery filter, bool publicOnly, Guid? businessId, CancellationToken ct = default)
    {
        var query = _db.Offers.Include(o => o.Business).Include(o => o.Slots).AsQueryable();

        if (publicOnly)
            query = query.Where(o => o.Status == nameof(OfferStatus.Active));
        else if (businessId.HasValue)
            query = query.Where(o => o.BusinessId == businessId);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var s = filter.Search.ToLower();
            query = query.Where(o => o.Title.ToLower().Contains(s) || o.Description.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(filter.BusinessType))
            query = query.Where(o => o.Business.BusinessType == filter.BusinessType);
        if (!string.IsNullOrWhiteSpace(filter.Category))
            query = query.Where(o => o.Category == filter.Category);
        if (!string.IsNullOrWhiteSpace(filter.Status))
            query = query.Where(o => o.Status == filter.Status);
        if (filter.MinPrice.HasValue)
            query = query.Where(o => o.OfferPrice >= filter.MinPrice);
        if (filter.MaxPrice.HasValue)
            query = query.Where(o => o.OfferPrice <= filter.MaxPrice);
        if (!string.IsNullOrWhiteSpace(filter.Date) && DateOnly.TryParse(filter.Date, out var fd))
            query = query.Where(o => o.StartDate <= fd && o.EndDate >= fd);
        if (filter.AvailableOnly == true)
            query = query.Where(o => o.Slots.Any(s => s.BookedCount < s.Capacity && s.Status == nameof(SlotStatus.Available)));

        var offers = await query.OrderByDescending(o => o.CreatedAt).ToListAsync(ct);
        return offers.Select(MapOffer).ToList();
    }

    public async Task<OfferDto?> GetByIdAsync(Guid id, bool publicOnly, CancellationToken ct = default)
    {
        var offer = await _db.Offers.Include(o => o.Business).Include(o => o.Slots)
            .FirstOrDefaultAsync(o => o.Id == id, ct);
        if (offer == null) return null;
        if (publicOnly && (offer.Status != nameof(OfferStatus.Active) || offer.Status == nameof(OfferStatus.Cancelled)))
            return null;
        return MapOffer(offer);
    }

    public async Task<OfferDto> CreateAsync(Guid businessId, CreateOfferRequest request, CancellationToken ct = default)
    {
        ValidateOfferPrices(request.OriginalPrice, request.OfferPrice);
        var discount = Math.Round((1 - request.OfferPrice / request.OriginalPrice) * 100, 2);

        var offer = new Offer
        {
            BusinessId = businessId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            OriginalPrice = request.OriginalPrice,
            OfferPrice = request.OfferPrice,
            DiscountPercentage = discount,
            StartDate = TimeParser.ParseDate(request.StartDate),
            EndDate = TimeParser.ParseDate(request.EndDate),
            StartTime = TimeParser.ParseTime(request.StartTime),
            EndTime = TimeParser.ParseTime(request.EndTime),
            TotalCapacity = request.TotalCapacity,
            MaxBookingPerCustomer = request.MaxBookingPerCustomer,
            TermsAndConditions = request.TermsAndConditions,
            Status = request.Status
        };
        _db.Offers.Add(offer);
        await _db.SaveChangesAsync(ct);
        await _db.Entry(offer).Reference(o => o.Business).LoadAsync(ct);
        offer.Slots = new List<OfferSlot>();
        return MapOffer(offer);
    }

    public async Task<OfferDto> UpdateAsync(Guid businessId, Guid id, UpdateOfferRequest request, CancellationToken ct = default)
    {
        var offer = await _db.Offers.Include(o => o.Business).Include(o => o.Slots)
            .FirstOrDefaultAsync(o => o.Id == id && o.BusinessId == businessId, ct)
            ?? throw new KeyNotFoundException("Offer not found.");

        ValidateOfferPrices(request.OriginalPrice, request.OfferPrice);
        offer.Title = request.Title;
        offer.Description = request.Description;
        offer.Category = request.Category;
        offer.OriginalPrice = request.OriginalPrice;
        offer.OfferPrice = request.OfferPrice;
        offer.DiscountPercentage = Math.Round((1 - request.OfferPrice / request.OriginalPrice) * 100, 2);
        offer.StartDate = TimeParser.ParseDate(request.StartDate);
        offer.EndDate = TimeParser.ParseDate(request.EndDate);
        offer.StartTime = TimeParser.ParseTime(request.StartTime);
        offer.EndTime = TimeParser.ParseTime(request.EndTime);
        offer.TotalCapacity = request.TotalCapacity;
        offer.MaxBookingPerCustomer = request.MaxBookingPerCustomer;
        offer.TermsAndConditions = request.TermsAndConditions;
        offer.Status = request.Status;
        offer.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return MapOffer(offer);
    }

    public async Task DeleteAsync(Guid businessId, Guid id, CancellationToken ct = default)
    {
        var offer = await _db.Offers.FirstOrDefaultAsync(o => o.Id == id && o.BusinessId == businessId, ct)
            ?? throw new KeyNotFoundException("Offer not found.");
        _db.Offers.Remove(offer);
        await _db.SaveChangesAsync(ct);
    }

    private static void ValidateOfferPrices(decimal original, decimal offer)
    {
        if (offer >= original)
            throw new InvalidOperationException("Offer price must be less than original price.");
    }

    private static OfferDto MapOffer(Offer o)
    {
        var available = o.Slots?.Where(s => s.Status == nameof(SlotStatus.Available))
            .Sum(s => s.AvailableCount) ?? 0;
        return new OfferDto(
            o.Id, o.BusinessId, o.Business?.BusinessName ?? "", o.Business?.BusinessType ?? "",
            o.Title, o.Description, o.Category, o.OriginalPrice, o.OfferPrice, o.DiscountPercentage,
            TimeParser.FormatDate(o.StartDate), TimeParser.FormatDate(o.EndDate),
            TimeParser.FormatTime(o.StartTime), TimeParser.FormatTime(o.EndTime),
            o.TotalCapacity, o.MaxBookingPerCustomer, o.TermsAndConditions, o.Status,
            available, o.Business?.City, o.Business?.Address);
    }
}
