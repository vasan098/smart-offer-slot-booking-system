namespace SmartOfferSlotBooking.Api.Entities;

public class Coupon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? OfferId { get; set; }
    public string Code { get; set; } = string.Empty;
    public decimal? DiscountAmount { get; set; }
    public decimal? DiscountPercent { get; set; }
    public int MaxUses { get; set; } = 100;
    public int UsedCount { get; set; }
    public DateOnly ValidFrom { get; set; }
    public DateOnly ValidTo { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Offer? Offer { get; set; }
}
