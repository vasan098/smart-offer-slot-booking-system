namespace SmartOfferSlotBooking.Api.DTOs;

public record BookingDto(
    Guid Id,
    string Reference,
    Guid OfferId,
    string OfferTitle,
    string BusinessName,
    Guid SlotId,
    string SlotDate,
    string SlotStartTime,
    string SlotEndTime,
    string CustomerName,
    string PhoneNumber,
    string? Email,
    int NumberOfPeople,
    string? SpecialNote,
    string Status,
    string PaymentStatus,
    string? CouponCode,
    string? QrCodeData,
    Guid CancellationToken,
    DateTime CreatedAt);

public record CreateBookingRequest(
    Guid OfferId,
    Guid SlotId,
    string CustomerName,
    string PhoneNumber,
    string? Email,
    int NumberOfPeople,
    string? SpecialNote,
    string? CouponCode);

public record UpdateBookingStatusRequest(string Status, string? PaymentStatus);

public record CancelBookingRequest(string CancellationToken);

public record WaitlistRequest(
    Guid SlotId,
    string CustomerName,
    string PhoneNumber,
    string? Email,
    int NumberOfPeople);

public record WaitlistDto(Guid Id, Guid SlotId, string CustomerName, string PhoneNumber, string Status, DateTime CreatedAt);

public record NotificationLogDto(Guid Id, string Channel, string Recipient, string? Subject, string Status, DateTime CreatedAt);
