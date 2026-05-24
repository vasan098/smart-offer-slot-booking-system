using Microsoft.AspNetCore.Mvc;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Services.Interfaces;

namespace SmartOfferSlotBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    /// <summary>Business owner / admin login</summary>
    [HttpPost("admin/login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LoginResponse>> AdminLogin([FromBody] LoginRequest request, CancellationToken ct) =>
        Ok(await _auth.LoginAdminAsync(request, ct));

    /// <summary>Customer login</summary>
    [HttpPost("user/login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LoginResponse>> UserLogin([FromBody] LoginRequest request, CancellationToken ct) =>
        Ok(await _auth.LoginUserAsync(request, ct));

    /// <summary>Customer registration</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct) =>
        Ok(await _auth.RegisterUserAsync(request, ct));

    /// <summary>Legacy login endpoint (admin)</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken ct) =>
        Ok(await _auth.LoginAdminAsync(request, ct));
}
