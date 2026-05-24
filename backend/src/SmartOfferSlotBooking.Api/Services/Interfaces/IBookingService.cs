using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Services.Interfaces;

public interface IBookingService
{
    Task<BookingDto> CreateAsync(CreateBookingRequest request, Guid? userId = null, CancellationToken ct = default);
    Task<List<BookingDto>> GetMyBookingsAsync(Guid userId, CancellationToken ct = default);
    Task<List<BookingDto>> GetAllAsync(Guid? businessId, CancellationToken ct = default);
    Task<BookingDto?> GetByIdAsync(Guid id, Guid? businessId, CancellationToken ct = default);
    Task<BookingDto?> GetByReferenceAsync(string reference, CancellationToken ct = default);
    Task<BookingDto> UpdateStatusAsync(Guid businessId, Guid id, UpdateBookingStatusRequest request, CancellationToken ct = default);
    Task<BookingDto> CancelByTokenAsync(string token, CancellationToken ct = default);
    Task<byte[]> ExportCsvAsync(Guid businessId, CancellationToken ct = default);
    Task<WaitlistDto> JoinWaitlistAsync(WaitlistRequest request, CancellationToken ct = default);
    Task<List<WaitlistDto>> GetWaitlistAsync(Guid slotId, CancellationToken ct = default);
}
