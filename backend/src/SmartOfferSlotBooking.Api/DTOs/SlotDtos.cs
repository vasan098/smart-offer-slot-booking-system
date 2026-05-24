namespace SmartOfferSlotBooking.Api.DTOs;

public record SlotDto(
    Guid Id,
    Guid OfferId,
    string SlotDate,
    string StartTime,
    string EndTime,
    int Capacity,
    int BookedCount,
    int AvailableCount,
    string Status);

public record CreateSlotRequest(
    Guid OfferId,
    string SlotDate,
    string StartTime,
    string EndTime,
    int Capacity,
    string Status);

public record UpdateSlotRequest(
    string SlotDate,
    string StartTime,
    string EndTime,
    int Capacity,
    string Status);
