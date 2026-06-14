using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobAppTracker.Infrastructure.Persistence.Configurations
{
    public class NoteConfig : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            builder.ToTable("Notes");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Content).IsRequired();

            // Relationships
            builder
                .HasOne(x => x.User)
                .WithMany(u => u.Notes)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(x => x.JobApplication)
                .WithMany(j => j.Notes)
                .HasForeignKey(x => x.JobAppId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
