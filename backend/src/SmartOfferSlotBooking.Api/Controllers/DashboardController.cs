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
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboard;
    private readonly ApplicationDbContext _db;

    public DashboardController(IDashboardService dashboard, ApplicationDbContext db)
    {
        _dashboard = dashboard;
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> Summary(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var businessId = await _db.Businesses.Where(b => b.UserId == userId).Select(b => b.Id).FirstOrDefaultAsync(ct);
        if (businessId == Guid.Empty) return NotFound("Business profile required.");
        return Ok(await _dashboard.GetSummaryAsync(businessId, ct));
    }
}
