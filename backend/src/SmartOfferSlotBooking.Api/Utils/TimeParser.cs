namespace SmartOfferSlotBooking.Api.Utils;

public static class TimeParser
{
    public static TimeSpan ParseTime(string value) =>
        TimeSpan.TryParse(value, out var t) ? t : throw new ArgumentException($"Invalid time: {value}");

    public static DateOnly ParseDate(string value) =>
        DateOnly.TryParse(value, out var d) ? d : throw new ArgumentException($"Invalid date: {value}");

    public static string FormatTime(TimeSpan t) => t.ToString(@"hh\:mm");

    public static string FormatDate(DateOnly d) => d.ToString("yyyy-MM-dd");
}
