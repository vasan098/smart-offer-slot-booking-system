using Microsoft.EntityFrameworkCore;

namespace SmartOfferSlotBooking.Api.Data;

/// <summary>Applies additive schema changes for existing dev databases.</summary>
public static class SchemaPatcher
{
    public static async Task ApplyAsync(ApplicationDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync("""
            ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);
            ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
            ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES "Users"("Id");
            CREATE INDEX IF NOT EXISTS idx_bookings_user ON "Bookings"(user_id);
            """);
    }
}
