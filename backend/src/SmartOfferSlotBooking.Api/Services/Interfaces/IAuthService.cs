using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAdminAsync(LoginRequest request, CancellationToken ct = default);
    Task<LoginResponse> LoginUserAsync(LoginRequest request, CancellationToken ct = default);
    Task<LoginResponse> RegisterUserAsync(RegisterRequest request, CancellationToken ct = default);
}
