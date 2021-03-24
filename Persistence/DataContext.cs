using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Persistence
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<DelegatedTask> DelegatedTasks { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<UserContact> UserContacts { get; set; }
        public DbSet<UserTask> UserTasks { get; set; }
        public DbSet<UserOperation> UserOperations { get; set; }
        public DbSet<SaleProcess> SaleProcess { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Order>(x =>
            {
                x.HasKey(o => new { o.Id });

                builder.Entity<Order>()
                    .HasOne<Contact>(u => u.Client)
                    .WithMany(c => c.Orders)
                    .HasForeignKey(c => c.ClientId)
                    .OnDelete(DeleteBehavior.SetNull);

            });
            builder.Entity<UserContact>(x =>
            {
                x.HasKey(uc => new { uc.UserId, uc.ContactId });

                builder.Entity<UserContact>()
                    .HasOne(uc => uc.User)
                    .WithMany(u => u.UserContacts)
                    .HasPrincipalKey(uc => uc.Id)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.Entity<UserContact>()
                    .HasOne(uc => uc.Contact)
                    .WithMany(c => c.UserContacts)
                    .HasForeignKey(c => c.ContactId)
                    .OnDelete(DeleteBehavior.Cascade);

            });

            builder.Entity<UserTask>(x =>
            {
                x.HasKey(ut => new { ut.CreatedById, ut.DelegatedTaskId });

                x.HasOne(ut => ut.CreatedBy)
                    .WithMany(u => u.UserTasks)
                    .HasForeignKey(ut => ut.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                x.HasOne(ut => ut.DelegatedTask)
                    .WithOne(t => t.UserTask)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<UserOperation>(x =>
            {
                x.HasKey(uo => new { uo.UserId, uo.OperationId });

                x.HasOne(uo => uo.User)
                    .WithMany(u => u.UserOperations)
                    .HasPrincipalKey(uc => uc.Id)
                    .OnDelete(DeleteBehavior.Cascade);
                x.HasOne(uo => uo.Operation)
                    .WithOne(o => o.UserOperation)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<SaleProcess>(x =>
            {
                x.HasKey(co => new { co.ContactId, co.OperationId });

                x.HasOne(co => co.Contact)
                    .WithMany(u => u.CurrentSale)
                    .HasForeignKey(co => co.ContactId)
                    .OnDelete(DeleteBehavior.Cascade);
                x.HasOne(co => co.Operation)
                    .WithOne(o => o.CurrentSale)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
