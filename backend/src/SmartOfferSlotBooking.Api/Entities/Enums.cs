namespace SmartOfferSlotBooking.Api.Entities;

public static class UserRoles
{
    public const string Admin = "Admin";
    public const string Customer = "Customer";
}

public enum OfferStatus
{
    Draft,
    Active,
    Paused,
    Expired,
    Cancelled
}

public enum SlotStatus
{
    Available,
    Full,
    Closed,
    Expired,
    Cancelled
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed,
    NoShow
}

public enum PaymentStatus
{
    Unpaid,
    Paid,
    Refunded,
    Failed
}

public enum BusinessType
{
    Restaurant,
    Gym,
    Salon,
    Clinic,
    Coaching,
    Turf,
    Other
}

public enum WaitlistStatus
{
    Waiting,
    Notified,
    Converted,
    Cancelled
}
