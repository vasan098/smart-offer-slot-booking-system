namespace SmartOfferSlotBooking.Api.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(
    string Email,
    string Password,
    string FullName,
    string PhoneNumber);

public record LoginResponse(string Token, DateTime ExpiresAt, UserDto User);

public record UserDto(
    Guid Id,
    string Email,
    string Role,
    string? FullName,
    string? PhoneNumber);
