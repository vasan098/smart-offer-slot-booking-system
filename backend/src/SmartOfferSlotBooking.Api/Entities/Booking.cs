namespace SmartOfferSlotBooking.Api.Entities;

public class Booking : BaseEntity
{
    public Guid? UserId { get; set; }
    public Guid OfferId { get; set; }
    public Guid SlotId { get; set; }
    public string Reference { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public int NumberOfPeople { get; set; } = 1;
    public string? SpecialNote { get; set; }
    public string Status { get; set; } = nameof(BookingStatus.Pending);
    public string PaymentStatus { get; set; } = "Unpaid";
    public string? CouponCode { get; set; }
    public Guid CancellationToken { get; set; } = Guid.NewGuid();
    public string? QrCodeData { get; set; }

    public User? User { get; set; }
    public Offer Offer { get; set; } = null!;
    public OfferSlot Slot { get; set; } = null!;
    public ICollection<NotificationLog> NotificationLogs { get; set; } = new List<NotificationLog>();
}
