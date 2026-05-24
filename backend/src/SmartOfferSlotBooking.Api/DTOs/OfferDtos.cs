namespace SmartOfferSlotBooking.Api.DTOs;

public record OfferDto(
    Guid Id,
    Guid BusinessId,
    string BusinessName,
    string BusinessType,
    string Title,
    string Description,
    string Category,
    decimal OriginalPrice,
    decimal OfferPrice,
    decimal DiscountPercentage,
    string StartDate,
    string EndDate,
    string StartTime,
    string EndTime,
    int TotalCapacity,
    int MaxBookingPerCustomer,
    string? TermsAndConditions,
    string Status,
    int AvailableSlots,
    string? City,
    string? Address);

public record CreateOfferRequest(
    string Title,
    string Description,
    string Category,
    decimal OriginalPrice,
    decimal OfferPrice,
    string StartDate,
    string EndDate,
    string StartTime,
    string EndTime,
    int TotalCapacity,
    int MaxBookingPerCustomer,
    string? TermsAndConditions,
    string Status);

public record UpdateOfferRequest(
    string Title,
    string Description,
    string Category,
    decimal OriginalPrice,
    decimal OfferPrice,
    string StartDate,
    string EndDate,
    string StartTime,
    string EndTime,
    int TotalCapacity,
    int MaxBookingPerCustomer,
    string? TermsAndConditions,
    string Status);

public record OfferFilterQuery(
    string? Search,
    string? BusinessType,
    string? Category,
    string? Date,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? AvailableOnly,
    string? Status);
