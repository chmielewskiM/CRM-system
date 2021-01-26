﻿using Domain;
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
        public DbSet<UserTask> UserTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserContact>(x =>
            {
                x.HasKey(uc => new { uc.UserId, uc.ContactId });

                builder.Entity<UserContact>()
                    .HasOne(u => u.User)
                    .WithMany(c => c.UserContacts)
                    .HasForeignKey(u => u.UserId);

                builder.Entity<UserContact>()
                    .HasOne(c => c.Contact)
                    .WithMany(u => u.UserContacts)
                    .HasForeignKey(c => c.ContactId);

            });

            builder.Entity<UserTask>(x =>
            {
                x.HasKey(ut => new { ut.UserId, ut.DelegatedTaskId });

                x.HasOne(u => u.User)
                    .WithMany(t => t.UserTasks)
                    .HasForeignKey(u => u.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                x.HasOne(t => t.DelegatedTask)
                    .WithMany(u => u.UserTasks)
                    .HasForeignKey(t => t.DelegatedTaskId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
