namespace SmartOfferSlotBooking.Api.DTOs;

public record DashboardSummaryDto(
    int TotalOffers,
    int ActiveOffers,
    int TotalBookings,
    int TodaysBookings,
    int TotalCapacity,
    int BookedSeats,
    int AvailableSeats,
    decimal ConversionRate,
    List<BookingDto> RecentBookings,
    Dictionary<string, int> BookingStatusStats,
    List<OfferPerformanceDto> OfferPerformance);

public record OfferPerformanceDto(string OfferTitle, int Bookings, decimal Revenue);

public record CouponDto(Guid Id, string Code, decimal? DiscountAmount, decimal? DiscountPercent, int MaxUses, int UsedCount, bool IsActive);

public record CreateCouponRequest(string Code, Guid? OfferId, decimal? DiscountAmount, decimal? DiscountPercent, int MaxUses, string ValidFrom, string ValidTo);

public record ValidateCouponResponse(bool Valid, string Message, decimal? DiscountAmount, decimal? DiscountPercent);
