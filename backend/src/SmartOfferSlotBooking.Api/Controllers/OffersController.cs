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
public class OffersController : ControllerBase
{
    private readonly IOfferService _offers;
    private readonly ApplicationDbContext _db;

    public OffersController(IOfferService offers, ApplicationDbContext db)
    {
        _offers = offers;
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<OfferDto>>> GetAll([FromQuery] OfferFilterQuery filter, CancellationToken ct)
    {
        var publicOnly = !User.Identity?.IsAuthenticated ?? true;
        Guid? businessId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            businessId = await _db.Businesses.Where(b => b.UserId == userId).Select(b => b.Id).FirstOrDefaultAsync(ct);
            if (businessId == Guid.Empty) businessId = null;
        }
        return Ok(await _offers.GetOffersAsync(filter, publicOnly, businessId, ct));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<OfferDto>> GetById(Guid id, CancellationToken ct)
    {
        var publicOnly = !User.Identity?.IsAuthenticated ?? true;
        var offer = await _offers.GetByIdAsync(id, publicOnly, ct);
        return offer == null ? NotFound() : Ok(offer);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OfferDto>> Create([FromBody] CreateOfferRequest request, CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        return Ok(await _offers.CreateAsync(businessId, request, ct));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OfferDto>> Update(Guid id, [FromBody] UpdateOfferRequest request, CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        return Ok(await _offers.UpdateAsync(businessId, id, request, ct));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        await _offers.DeleteAsync(businessId, id, ct);
        return NoContent();
    }

    private async Task<Guid> GetBusinessIdAsync(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var id = await _db.Businesses.Where(b => b.UserId == userId).Select(b => b.Id).FirstOrDefaultAsync(ct);
        if (id == Guid.Empty) throw new InvalidOperationException("Create a business profile first.");
        return id;
    }
}
