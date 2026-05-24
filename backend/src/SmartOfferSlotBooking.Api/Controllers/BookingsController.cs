using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;

namespace SmartOfferSlotBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookings;
    private readonly ApplicationDbContext _db;

    public BookingsController(IBookingService bookings, ApplicationDbContext db)
    {
        _bookings = bookings;
        _db = db;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<BookingDto>> Create([FromBody] CreateBookingRequest request, CancellationToken ct)
    {
        Guid? userId = null;
        if (User.Identity?.IsAuthenticated == true &&
            User.IsInRole(UserRoles.Customer))
        {
            userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
        return Ok(await _bookings.CreateAsync(request, userId, ct));
    }

    [HttpGet("my")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<List<BookingDto>>> GetMyBookings(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _bookings.GetMyBookingsAsync(userId, ct));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<BookingDto>>> GetAll(CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        return Ok(await _bookings.GetAllAsync(businessId, ct));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookingDto>> GetById(Guid id, CancellationToken ct)
    {
        Guid? businessId = User.Identity?.IsAuthenticated == true ? await GetBusinessIdAsync(ct) : null;
        var booking = await _bookings.GetByIdAsync(id, businessId, ct);
        return booking == null ? NotFound() : Ok(booking);
    }

    [HttpGet("reference/{reference}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookingDto>> GetByReference(string reference, CancellationToken ct)
    {
        var booking = await _bookings.GetByReferenceAsync(reference, ct);
        return booking == null ? NotFound() : Ok(booking);
    }

    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookingDto>> UpdateStatus(Guid id, [FromBody] UpdateBookingStatusRequest request, CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        return Ok(await _bookings.UpdateStatusAsync(businessId, id, request, ct));
    }

    [HttpPost("cancel/{token}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookingDto>> Cancel(string token, CancellationToken ct) =>
        Ok(await _bookings.CancelByTokenAsync(token, ct));

    [HttpGet("export")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Export(CancellationToken ct)
    {
        var businessId = await GetBusinessIdAsync(ct);
        var bytes = await _bookings.ExportCsvAsync(businessId, ct);
        return File(bytes, "text/csv", $"bookings-{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    [HttpPost("waitlist")]
    [AllowAnonymous]
    public async Task<ActionResult<WaitlistDto>> JoinWaitlist([FromBody] WaitlistRequest request, CancellationToken ct) =>
        Ok(await _bookings.JoinWaitlistAsync(request, ct));

    [HttpGet("waitlist")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<WaitlistDto>>> GetWaitlist([FromQuery] Guid slotId, CancellationToken ct) =>
        Ok(await _bookings.GetWaitlistAsync(slotId, ct));

    private async Task<Guid> GetBusinessIdAsync(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return await _db.Businesses.Where(b => b.UserId == userId).Select(b => b.Id).FirstAsync(ct);
    }
}
