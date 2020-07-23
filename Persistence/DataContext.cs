using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) :base(options)
        {

        }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<ProductionStock> Stocks { get; set; }
        public DbSet<Objective> Objectives { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
                builder.Entity<ProductionStock>()
                .HasData(
                    new ProductionStock {Id = 1, Name = "steel1", Count = 1},
                    new ProductionStock {Id = 2, Name = "steel2", Count = 4},
                    new ProductionStock {Id = 3, Name = "steel3", Count = 3},
                    new ProductionStock {Id = 4, Name = "steel4", Count = 6},
                    new ProductionStock {Id = 5, Name = "steel5", Count = 5}
                );
        }
    }
}
