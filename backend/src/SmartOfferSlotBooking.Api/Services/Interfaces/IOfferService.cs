using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Services.Interfaces;

public interface IOfferService
{
    Task<List<OfferDto>> GetOffersAsync(OfferFilterQuery filter, bool publicOnly, Guid? businessId, CancellationToken ct = default);
    Task<OfferDto?> GetByIdAsync(Guid id, bool publicOnly, CancellationToken ct = default);
    Task<OfferDto> CreateAsync(Guid businessId, CreateOfferRequest request, CancellationToken ct = default);
    Task<OfferDto> UpdateAsync(Guid businessId, Guid id, UpdateOfferRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid businessId, Guid id, CancellationToken ct = default);
}
