using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobAppTracker.Infrastructure.Persistence.Configurations
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // properties

            builder.ToTable("Users");
            builder.HasIndex(u => u.Email).IsUnique();
            builder.Property(u => u.FirstName).IsRequired().HasMaxLength(50);

            builder.Property(u => u.LastName).IsRequired().HasMaxLength(50);

            // Configure Location as owned type

            builder.OwnsOne(
                u => u.Location,
                loc =>
                {
                    loc.Property(l => l.Country).HasMaxLength(100);
                    loc.Property(l => l.City).HasMaxLength(100);
                    loc.Property(l => l.Street).HasMaxLength(200);
                    loc.Property(l => l.PostalCode);
                }
            );
        }
    }
}
