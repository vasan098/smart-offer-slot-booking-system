using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Services.Interfaces;

public interface IBusinessService
{
    Task<BusinessDto> CreateAsync(Guid userId, CreateBusinessRequest request, CancellationToken ct = default);
    Task<BusinessDto?> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<BusinessDto> UpdateAsync(Guid userId, Guid id, UpdateBusinessRequest request, CancellationToken ct = default);
}
