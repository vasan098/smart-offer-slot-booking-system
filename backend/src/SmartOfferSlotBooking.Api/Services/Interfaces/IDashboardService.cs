using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(Guid businessId, CancellationToken ct = default);
}
