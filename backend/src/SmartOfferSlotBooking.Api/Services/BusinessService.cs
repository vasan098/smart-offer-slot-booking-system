using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;
using SmartOfferSlotBooking.Api.Utils;

namespace SmartOfferSlotBooking.Api.Services;

public class BusinessService : IBusinessService
{
    private readonly ApplicationDbContext _db;

    public BusinessService(ApplicationDbContext db) => _db = db;

    public async Task<BusinessDto> CreateAsync(Guid userId, CreateBusinessRequest request, CancellationToken ct = default)
    {
        if (await _db.Businesses.AnyAsync(b => b.UserId == userId, ct))
            throw new InvalidOperationException("Business profile already exists.");

        var business = new Business
        {
            UserId = userId,
            BusinessName = request.BusinessName,
            BusinessType = request.BusinessType,
            OwnerName = request.OwnerName,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            Address = request.Address,
            City = request.City,
            LogoUrl = request.LogoUrl,
            OpeningTime = TimeParser.ParseTime(request.OpeningTime),
            ClosingTime = TimeParser.ParseTime(request.ClosingTime)
        };
        _db.Businesses.Add(business);
        await _db.SaveChangesAsync(ct);
        return Map(business);
    }

    public async Task<BusinessDto?> GetByUserAsync(Guid userId, CancellationToken ct = default)
    {
        var b = await _db.Businesses.FirstOrDefaultAsync(x => x.UserId == userId, ct);
        return b == null ? null : Map(b);
    }

    public async Task<BusinessDto> UpdateAsync(Guid userId, Guid id, UpdateBusinessRequest request, CancellationToken ct = default)
    {
        var business = await _db.Businesses.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId, ct)
            ?? throw new KeyNotFoundException("Business not found.");

        business.BusinessName = request.BusinessName;
        business.BusinessType = request.BusinessType;
        business.OwnerName = request.OwnerName;
        business.PhoneNumber = request.PhoneNumber;
        business.Email = request.Email;
        business.Address = request.Address;
        business.City = request.City;
        business.LogoUrl = request.LogoUrl;
        business.OpeningTime = TimeParser.ParseTime(request.OpeningTime);
        business.ClosingTime = TimeParser.ParseTime(request.ClosingTime);
        business.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return Map(business);
    }

    private static BusinessDto Map(Business b) => new(
        b.Id, b.BusinessName, b.BusinessType, b.OwnerName, b.PhoneNumber, b.Email,
        b.Address, b.City, b.LogoUrl, TimeParser.FormatTime(b.OpeningTime), TimeParser.FormatTime(b.ClosingTime));
}
