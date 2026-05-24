using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Services.Interfaces;

namespace SmartOfferSlotBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotsController : ControllerBase
{
    private readonly ISlotService _slots;
    private readonly ApplicationDbContext _db;

    public SlotsController(ISlotService slots, ApplicationDbContext db)
    {
        _slots = slots;
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<SlotDto>>> GetAll([FromQuery] Guid? offerId, CancellationToken ct) =>
        Ok(await _slots.GetAllAsync(offerId, ct));

    [HttpGet("/api/offers/{offerId:guid}/slots")]
    [AllowAnonymous]
    public async Task<ActionResult<List<SlotDto>>> GetByOffer(Guid offerId, CancellationToken ct) =>
        Ok(await _slots.GetByOfferIdAsync(offerId, ct));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SlotDto>> Create([FromBody] CreateSlotRequest request, CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        return Ok(await _slots.CreateAsync(businessId, request, ct));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SlotDto>> Update(Guid id, [FromBody] UpdateSlotRequest request, CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        return Ok(await _slots.UpdateAsync(businessId, id, request, ct));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        await _slots.DeleteAsync(businessId, id, ct);
        return NoContent();
    }

    private async Task<Guid> GetBusinessIdAsync(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return await _db.Businesses.Where(b => b.UserId == userId).Select(b => b.Id).FirstAsync(ct);
    }
}
