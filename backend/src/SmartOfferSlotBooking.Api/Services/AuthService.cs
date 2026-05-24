using Microsoft.EntityFrameworkCore;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;

namespace SmartOfferSlotBooking.Api.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _db;
    private readonly JwtTokenService _jwt;

    public AuthService(ApplicationDbContext db, JwtTokenService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public Task<LoginResponse> LoginAdminAsync(LoginRequest request, CancellationToken ct = default) =>
        LoginWithRoleAsync(request, UserRoles.Admin, "Invalid admin credentials.", ct);

    public Task<LoginResponse> LoginUserAsync(LoginRequest request, CancellationToken ct = default) =>
        LoginWithRoleAsync(request, UserRoles.Customer, "Invalid email or password.", ct);

    public async Task<LoginResponse> RegisterUserAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email, ct))
            throw new InvalidOperationException("An account with this email already exists.");

        var user = new User
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRoles.Customer,
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim()
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);
        return BuildResponse(user);
    }

    private async Task<LoginResponse> LoginWithRoleAsync(
        LoginRequest request,
        string expectedRole,
        string errorMessage,
        CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(
            u => u.Email == request.Email.Trim().ToLowerInvariant(), ct);

        if (user == null || user.Role != expectedRole ||
            !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException(errorMessage);

        return BuildResponse(user);
    }

    private LoginResponse BuildResponse(User user)
    {
        var (token, expires) = _jwt.GenerateToken(user);
        return new LoginResponse(
            token,
            expires,
            new UserDto(user.Id, user.Email, user.Role, user.FullName, user.PhoneNumber));
    }
}
