using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<ChatSession> ChatSessions { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── User ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.GoogleId).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
        });

        // ── ChatSession ───────────────────────────────────────────────────────
        modelBuilder.Entity<ChatSession>(e =>
        {
            e.HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(s => new { s.UserId, s.IsActive });
        });

        // ── ChatMessage ───────────────────────────────────────────────────────
        modelBuilder.Entity<ChatMessage>(e =>
        {
            e.HasOne(m => m.ChatSession)
                .WithMany(s => s.Messages)
                .HasForeignKey(m => m.ChatSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Content stores the full message as a JSON string — no length cap
            e.Property(m => m.Content).HasColumnType("text");

            e.HasIndex(m => new { m.ChatSessionId, m.OrderNumber });
        });
    }
}