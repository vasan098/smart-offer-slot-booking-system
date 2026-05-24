namespace SmartOfferSlotBooking.Api.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = UserRoles.Admin;
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }

    public Business? Business { get; set; }
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
