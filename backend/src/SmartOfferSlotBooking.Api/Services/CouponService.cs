using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;
using SmartOfferSlotBooking.Api.Utils;

namespace SmartOfferSlotBooking.Api.Services;

public class CouponService : ICouponService
{
    private readonly ApplicationDbContext _db;

    public CouponService(ApplicationDbContext db) => _db = db;

    public async Task<CouponDto> CreateAsync(CreateCouponRequest request, CancellationToken ct = default)
    {
        var coupon = new Coupon
        {
            OfferId = request.OfferId,
            Code = request.Code.ToUpperInvariant(),
            DiscountAmount = request.DiscountAmount,
            DiscountPercent = request.DiscountPercent,
            MaxUses = request.MaxUses,
            ValidFrom = TimeParser.ParseDate(request.ValidFrom),
            ValidTo = TimeParser.ParseDate(request.ValidTo)
        };
        _db.Coupons.Add(coupon);
        await _db.SaveChangesAsync(ct);
        return new CouponDto(coupon.Id, coupon.Code, coupon.DiscountAmount, coupon.DiscountPercent, coupon.MaxUses, coupon.UsedCount, coupon.IsActive);
    }

    public async Task<ValidateCouponResponse> ValidateAsync(string code, Guid? offerId, CancellationToken ct = default)
    {
        var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == code.ToUpperInvariant(), ct);
        if (coupon == null) return new ValidateCouponResponse(false, "Invalid coupon code.", null, null);
        if (!coupon.IsActive) return new ValidateCouponResponse(false, "Coupon is inactive.", null, null);
        if (coupon.UsedCount >= coupon.MaxUses) return new ValidateCouponResponse(false, "Coupon usage limit reached.", null, null);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (today < coupon.ValidFrom || today > coupon.ValidTo)
            return new ValidateCouponResponse(false, "Coupon is not valid for the current date.", null, null);
        if (coupon.OfferId.HasValue && offerId.HasValue && coupon.OfferId != offerId)
            return new ValidateCouponResponse(false, "Coupon not valid for this offer.", null, null);
        return new ValidateCouponResponse(true, "Coupon applied.", coupon.DiscountAmount, coupon.DiscountPercent);
    }
}
