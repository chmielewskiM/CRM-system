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
        public DbSet<ProductionStocks> Stocks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Contact>()
                .HasData(
                    new Contact {Id = 1, Name = "max1"},
                    new Contact {Id = 2, Name = "max2"},
                    new Contact {Id = 3, Name = "max3"},
                    new Contact {Id = 4, Name = "max4"},
                    new Contact {Id = 5, Name = "max5"}
                );
                builder.Entity<ProductionStocks>()
                .HasData(
                    new ProductionStocks {Id = 1, Name = "steel1", Count = 1},
                    new ProductionStocks {Id = 2, Name = "steel2", Count = 4},
                    new ProductionStocks {Id = 3, Name = "steel3", Count = 3},
                    new ProductionStocks {Id = 4, Name = "steel4", Count = 6},
                    new ProductionStocks {Id = 5, Name = "steel5", Count = 5}
                );
        }
    }
}
