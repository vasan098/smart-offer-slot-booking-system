using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Services.Interfaces;

public interface ISlotService
{
    Task<List<SlotDto>> GetByOfferIdAsync(Guid offerId, CancellationToken ct = default);
    Task<List<SlotDto>> GetAllAsync(Guid? offerId, CancellationToken ct = default);
    Task<SlotDto> CreateAsync(Guid businessId, CreateSlotRequest request, CancellationToken ct = default);
    Task<SlotDto> UpdateAsync(Guid businessId, Guid id, UpdateSlotRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid businessId, Guid id, CancellationToken ct = default);
}
