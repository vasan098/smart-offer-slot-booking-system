namespace SmartOfferSlotBooking.Api.Entities;

public class OfferSlot : BaseEntity
{
    public Guid OfferId { get; set; }
    public DateOnly SlotDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int Capacity { get; set; }
    public int BookedCount { get; set; }
    public string Status { get; set; } = nameof(SlotStatus.Available);

    public int AvailableCount => Math.Max(0, Capacity - BookedCount);

    public Offer Offer { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<WaitlistEntry> WaitlistEntries { get; set; } = new List<WaitlistEntry>();
}
