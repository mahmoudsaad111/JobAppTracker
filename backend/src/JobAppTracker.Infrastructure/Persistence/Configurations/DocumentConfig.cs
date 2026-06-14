using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobAppTracker.Infrastructure.Persistence.Configurations
{
    public class DocumentConfig : IEntityTypeConfiguration<Document>
    {
        public void Configure(EntityTypeBuilder<Document> builder)
        {
            builder.ToTable("Documents");
            builder.HasKey(d => d.Id);
            builder.Property(d => d.FileName).IsRequired().HasMaxLength(255);
            builder.Property(d => d.FilePath).IsRequired().HasMaxLength(500);

            // Relationships
            builder
                .HasOne(d => d.User)
                .WithMany(u => u.Documents)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(d => d.JobApplication)
                .WithMany(ja => ja.Documents)
                .HasForeignKey(d => d.JobApplicationId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
