namespace SmartOfferSlotBooking.Api.DTOs;

public record BusinessDto(
    Guid Id,
    string BusinessName,
    string BusinessType,
    string OwnerName,
    string PhoneNumber,
    string Email,
    string Address,
    string City,
    string? LogoUrl,
    string OpeningTime,
    string ClosingTime);

public record CreateBusinessRequest(
    string BusinessName,
    string BusinessType,
    string OwnerName,
    string PhoneNumber,
    string Email,
    string Address,
    string City,
    string? LogoUrl,
    string OpeningTime,
    string ClosingTime);

public record UpdateBusinessRequest(
    string BusinessName,
    string BusinessType,
    string OwnerName,
    string PhoneNumber,
    string Email,
    string Address,
    string City,
    string? LogoUrl,
    string OpeningTime,
    string ClosingTime);
