using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<DelegatedTask> DelegatedTasks { get; set; }
        public DbSet<Call> Calls { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<UserContact> UserContacts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserContact>(x => x.HasKey(ua => new { ua.UserId, ua.ContactId }));

            builder.Entity<UserContact>()
            .HasOne(u => u.User)
            .WithMany(a => a.UserContacts)
            .HasForeignKey(u => u.UserId);

            builder.Entity<UserContact>()
            .HasOne(a => a.Contact)
            .WithMany(u => u.UserContacts)
            .HasForeignKey(a => a.ContactId);


        }
    }
}
