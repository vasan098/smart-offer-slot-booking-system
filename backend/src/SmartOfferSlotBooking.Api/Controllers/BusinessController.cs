using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Services.Interfaces;

namespace SmartOfferSlotBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class BusinessController : ControllerBase
{
    private readonly IBusinessService _business;

    public BusinessController(IBusinessService business) => _business = business;

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<ActionResult<BusinessDto>> Create([FromBody] CreateBusinessRequest request, CancellationToken ct) =>
        Ok(await _business.CreateAsync(UserId, request, ct));

    [HttpGet]
    public async Task<ActionResult<BusinessDto>> Get(CancellationToken ct)
    {
        var result = await _business.GetByUserAsync(UserId, ct);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BusinessDto>> Update(Guid id, [FromBody] UpdateBusinessRequest request, CancellationToken ct) =>
        Ok(await _business.UpdateAsync(UserId, id, request, ct));
}
