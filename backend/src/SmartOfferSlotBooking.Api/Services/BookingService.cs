using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using SmartOfferSlotBooking.Api.Data;
using SmartOfferSlotBooking.Api.DTOs;
using SmartOfferSlotBooking.Api.Entities;
using SmartOfferSlotBooking.Api.Services.Interfaces;
using SmartOfferSlotBooking.Api.Utils;

namespace SmartOfferSlotBooking.Api.Services;

public class BookingService : IBookingService
{
    private readonly ApplicationDbContext _db;
    private readonly ICouponService _coupons;

    public BookingService(ApplicationDbContext db, ICouponService coupons)
    {
        _db = db;
        _coupons = coupons;
    }

    public async Task<BookingDto> CreateAsync(CreateBookingRequest request, Guid? userId = null, CancellationToken ct = default)
    {
        var offer = await _db.Offers.Include(o => o.Business).FirstOrDefaultAsync(o => o.Id == request.OfferId, ct)
            ?? throw new KeyNotFoundException("Offer not found.");

        if (offer.Status != nameof(OfferStatus.Active))
            throw new InvalidOperationException("This offer is not available for booking.");
        if (offer.EndDate < DateOnly.FromDateTime(DateTime.UtcNow))
            throw new InvalidOperationException("Expired offers cannot be booked.");

        var slot = await _db.OfferSlots.FirstOrDefaultAsync(s => s.Id == request.SlotId && s.OfferId == request.OfferId, ct)
            ?? throw new KeyNotFoundException("Slot not found.");

        if (slot.Status is nameof(SlotStatus.Full) or nameof(SlotStatus.Closed) or nameof(SlotStatus.Expired) or nameof(SlotStatus.Cancelled))
            throw new InvalidOperationException("Selected slot is not available.");
        if (slot.AvailableCount < request.NumberOfPeople)
            throw new InvalidOperationException("Not enough availability for the requested number of people.");

        var existingCount = await _db.Bookings
            .Where(b => b.OfferId == offer.Id && b.PhoneNumber == request.PhoneNumber && b.Status != nameof(BookingStatus.Cancelled))
            .SumAsync(b => b.NumberOfPeople, ct);

        if (existingCount + request.NumberOfPeople > offer.MaxBookingPerCustomer)
            throw new InvalidOperationException($"Maximum {offer.MaxBookingPerCustomer} booking(s) per customer for this offer.");

        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var validation = await _coupons.ValidateAsync(request.CouponCode, offer.Id, ct);
            if (!validation.Valid) throw new InvalidOperationException(validation.Message);
        }

        var reference = $"BK{DateTime.UtcNow:yyMMdd}{Random.Shared.Next(1000, 9999)}";
        var booking = new Booking
        {
            UserId = userId,
            OfferId = offer.Id,
            SlotId = slot.Id,
            Reference = reference,
            CustomerName = request.CustomerName,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            NumberOfPeople = request.NumberOfPeople,
            SpecialNote = request.SpecialNote,
            Status = nameof(BookingStatus.Confirmed),
            PaymentStatus = "Unpaid",
            CouponCode = request.CouponCode,
            CancellationToken = Guid.NewGuid()
        };

        var qrPayload = $"REF:{reference}|OFFER:{offer.Title}|SLOT:{slot.SlotDate} {slot.StartTime}";
        booking.QrCodeData = GenerateQrBase64(qrPayload);

        slot.BookedCount += request.NumberOfPeople;
        SlotService.UpdateSlotStatus(slot);

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync(ct);

        await LogNotificationsAsync(booking, offer, slot, ct);

        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == request.CouponCode.ToUpperInvariant(), ct);
            if (coupon != null) { coupon.UsedCount++; await _db.SaveChangesAsync(ct); }
        }

        return await MapBooking(booking.Id, ct) ?? throw new InvalidOperationException("Booking creation failed.");
    }

    public async Task<List<BookingDto>> GetMyBookingsAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _db.Users.FindAsync([userId], ct)
            ?? throw new KeyNotFoundException("User not found.");

        var bookings = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o.Business)
            .Include(b => b.Slot)
            .Where(b =>
                b.UserId == userId ||
                (!string.IsNullOrEmpty(user.PhoneNumber) && b.PhoneNumber == user.PhoneNumber) ||
                (!string.IsNullOrEmpty(user.Email) && b.Email == user.Email))
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(ct);

        return bookings.Select(Map).ToList();
    }

    public async Task<List<BookingDto>> GetAllAsync(Guid? businessId, CancellationToken ct = default)
    {
        var query = _db.Bookings.Include(b => b.Offer).ThenInclude(o => o.Business).Include(b => b.Slot).AsQueryable();
        if (businessId.HasValue)
            query = query.Where(b => b.Offer.BusinessId == businessId);
        var list = await query.OrderByDescending(b => b.CreatedAt).ToListAsync(ct);
        var result = new List<BookingDto>();
        foreach (var b in list) result.Add(Map(b));
        return result;
    }

    public async Task<BookingDto?> GetByIdAsync(Guid id, Guid? businessId, CancellationToken ct = default)
    {
        var booking = await _db.Bookings.Include(b => b.Offer).ThenInclude(o => o.Business).Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.Id == id, ct);
        if (booking == null) return null;
        if (businessId.HasValue && booking.Offer.BusinessId != businessId) return null;
        return Map(booking);
    }

    public async Task<BookingDto?> GetByReferenceAsync(string reference, CancellationToken ct = default)
    {
        var booking = await _db.Bookings.Include(b => b.Offer).ThenInclude(o => o.Business).Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.Reference == reference, ct);
        return booking == null ? null : Map(booking);
    }

    public async Task<BookingDto> UpdateStatusAsync(Guid businessId, Guid id, UpdateBookingStatusRequest request, CancellationToken ct = default)
    {
        var booking = await _db.Bookings.Include(b => b.Offer).Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.Id == id && b.Offer.BusinessId == businessId, ct)
            ?? throw new KeyNotFoundException("Booking not found.");

        var prevStatus = booking.Status;
        booking.Status = request.Status;
        if (!string.IsNullOrWhiteSpace(request.PaymentStatus))
            booking.PaymentStatus = request.PaymentStatus;
        booking.UpdatedAt = DateTime.UtcNow;

        if (request.Status == nameof(BookingStatus.Cancelled) && prevStatus != nameof(BookingStatus.Cancelled))
        {
            booking.Slot.BookedCount = Math.Max(0, booking.Slot.BookedCount - booking.NumberOfPeople);
            SlotService.UpdateSlotStatus(booking.Slot);
        }

        await _db.SaveChangesAsync(ct);
        return Map(booking);
    }

    public async Task<BookingDto> CancelByTokenAsync(string token, CancellationToken ct = default)
    {
        if (!Guid.TryParse(token, out var guid))
            throw new ArgumentException("Invalid cancellation token.");

        var booking = await _db.Bookings.Include(b => b.Offer).ThenInclude(o => o.Business).Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.CancellationToken == guid, ct)
            ?? throw new KeyNotFoundException("Booking not found.");

        return await UpdateStatusAsync(booking.Offer.BusinessId, booking.Id,
            new UpdateBookingStatusRequest(nameof(BookingStatus.Cancelled), booking.PaymentStatus), ct);
    }

    public async Task<byte[]> ExportCsvAsync(Guid businessId, CancellationToken ct = default)
    {
        var bookings = await GetAllAsync(businessId, ct);
        var sb = new StringBuilder();
        sb.AppendLine("Reference,Offer,Customer,Phone,Date,Time,People,Status,Payment,CreatedAt");
        foreach (var b in bookings)
        {
            sb.AppendLine(string.Join(",",
                b.Reference, Escape(b.OfferTitle), Escape(b.CustomerName), b.PhoneNumber,
                b.SlotDate, $"{b.SlotStartTime}-{b.SlotEndTime}", b.NumberOfPeople,
                b.Status, b.PaymentStatus, b.CreatedAt.ToString("o", CultureInfo.InvariantCulture)));
        }
        return Encoding.UTF8.GetBytes(sb.ToString());
    }

    public async Task<WaitlistDto> JoinWaitlistAsync(WaitlistRequest request, CancellationToken ct = default)
    {
        var slot = await _db.OfferSlots.FirstOrDefaultAsync(s => s.Id == request.SlotId, ct)
            ?? throw new KeyNotFoundException("Slot not found.");
        if (slot.Status != nameof(SlotStatus.Full))
            throw new InvalidOperationException("Waitlist is only available when the slot is full.");

        var entry = new WaitlistEntry
        {
            SlotId = request.SlotId,
            CustomerName = request.CustomerName,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            NumberOfPeople = request.NumberOfPeople
        };
        _db.WaitlistEntries.Add(entry);
        await _db.SaveChangesAsync(ct);
        return new WaitlistDto(entry.Id, entry.SlotId, entry.CustomerName, entry.PhoneNumber, entry.Status, entry.CreatedAt);
    }

    public async Task<List<WaitlistDto>> GetWaitlistAsync(Guid slotId, CancellationToken ct = default)
    {
        return await _db.WaitlistEntries.Where(w => w.SlotId == slotId)
            .OrderBy(w => w.CreatedAt)
            .Select(w => new WaitlistDto(w.Id, w.SlotId, w.CustomerName, w.PhoneNumber, w.Status, w.CreatedAt))
            .ToListAsync(ct);
    }

    private async Task LogNotificationsAsync(Booking booking, Offer offer, OfferSlot slot, CancellationToken ct)
    {
        var body = $"Hi {booking.CustomerName}, your booking {booking.Reference} for {offer.Title} on {slot.SlotDate} at {slot.StartTime} is confirmed.";
        _db.NotificationLogs.AddRange(
            new NotificationLog { BookingId = booking.Id, Channel = "SMS", Recipient = booking.PhoneNumber, Subject = "Booking Confirmed", Body = body },
            new NotificationLog { BookingId = booking.Id, Channel = "Email", Recipient = booking.Email ?? "noreply@smartoffer.demo", Subject = "Booking Confirmation", Body = body }
        );
        await _db.SaveChangesAsync(ct);
    }

    private async Task<BookingDto?> MapBooking(Guid id, CancellationToken ct)
    {
        var b = await _db.Bookings.Include(x => x.Offer).ThenInclude(o => o.Business).Include(x => x.Slot)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        return b == null ? null : Map(b);
    }

    private static BookingDto Map(Booking b) => new(
        b.Id, b.Reference, b.OfferId, b.Offer.Title, b.Offer.Business?.BusinessName ?? "",
        b.SlotId, TimeParser.FormatDate(b.Slot.SlotDate), TimeParser.FormatTime(b.Slot.StartTime),
        TimeParser.FormatTime(b.Slot.EndTime), b.CustomerName, b.PhoneNumber, b.Email,
        b.NumberOfPeople, b.SpecialNote, b.Status, b.PaymentStatus, b.CouponCode,
        b.QrCodeData, b.CancellationToken, b.CreatedAt);

    private static string GenerateQrBase64(string payload)
    {
        using var gen = new QRCodeGenerator();
        using var data = gen.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);
        var qr = new PngByteQRCode(data);
        return Convert.ToBase64String(qr.GetGraphic(8));
    }

    private static string Escape(string? s) => $"\"{(s ?? "").Replace("\"", "\"\"")}\"";
}
