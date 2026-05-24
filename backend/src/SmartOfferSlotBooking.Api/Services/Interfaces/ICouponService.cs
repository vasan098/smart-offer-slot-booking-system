using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Services.Interfaces;

public interface ICouponService
{
    Task<CouponDto> CreateAsync(CreateCouponRequest request, CancellationToken ct = default);
    Task<ValidateCouponResponse> ValidateAsync(string code, Guid? offerId, CancellationToken ct = default);
}
