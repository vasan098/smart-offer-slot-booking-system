using FluentValidation;
using SmartOfferSlotBooking.Api.DTOs;

namespace SmartOfferSlotBooking.Api.Validators;

public class CreateOfferRequestValidator : AbstractValidator<CreateOfferRequest>
{
    public CreateOfferRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.OriginalPrice).GreaterThan(0);
        RuleFor(x => x.OfferPrice).GreaterThan(0).LessThan(x => x.OriginalPrice);
        RuleFor(x => x.TotalCapacity).GreaterThan(0);
        RuleFor(x => x.MaxBookingPerCustomer).GreaterThan(0);
    }
}
