using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobAppTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "JobApplications",
                type: "nvarchar(max)",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "InterviewType",
                table: "Interviews",
                type: "int",
                nullable: false,
                defaultValue: 0
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Location", table: "JobApplications");

            migrationBuilder.DropColumn(name: "InterviewType", table: "Interviews");
        }
    }
}
