namespace SmartOfferSlotBooking.Api.Entities;

public class WaitlistEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SlotId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public int NumberOfPeople { get; set; } = 1;
    public string Status { get; set; } = nameof(WaitlistStatus.Waiting);
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public OfferSlot Slot { get; set; } = null!;
}
