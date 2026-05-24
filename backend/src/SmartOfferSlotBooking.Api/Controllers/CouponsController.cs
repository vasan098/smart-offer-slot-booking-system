using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Services.Interfaces;

namespace SmartOfferSlotBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly ICouponService _coupons;

    public CouponsController(ICouponService coupons) => _coupons = coupons;

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CouponDto>> Create([FromBody] CreateCouponRequest request, CancellationToken ct) =>
        Ok(await _coupons.CreateAsync(request, ct));

    [HttpGet("validate")]
    [AllowAnonymous]
    public async Task<ActionResult<ValidateCouponResponse>> Validate([FromQuery] string code, [FromQuery] Guid? offerId, CancellationToken ct) =>
        Ok(await _coupons.ValidateAsync(code, offerId, ct));
}
