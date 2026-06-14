using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobAppTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class update4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_JobApplications_JobApplicationId",
                table: "Notes"
            );

            migrationBuilder.DropIndex(name: "IX_Notes_JobApplicationId", table: "Notes");

            migrationBuilder.DropColumn(name: "JobApplicationId", table: "Notes");

            migrationBuilder.RenameColumn(name: "content", table: "Notes", newName: "Content");

            migrationBuilder.AddColumn<Guid>(
                name: "JobAppId",
                table: "Notes",
                type: "uniqueidentifier",
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Notes_JobAppId",
                table: "Notes",
                column: "JobAppId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_JobApplications_JobAppId",
                table: "Notes",
                column: "JobAppId",
                principalTable: "JobApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_JobApplications_JobAppId",
                table: "Notes"
            );

            migrationBuilder.DropIndex(name: "IX_Notes_JobAppId", table: "Notes");

            migrationBuilder.DropColumn(name: "JobAppId", table: "Notes");

            migrationBuilder.RenameColumn(name: "Content", table: "Notes", newName: "content");

            migrationBuilder.AddColumn<Guid>(
                name: "JobApplicationId",
                table: "Notes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000")
            );

            migrationBuilder.CreateIndex(
                name: "IX_Notes_JobApplicationId",
                table: "Notes",
                column: "JobApplicationId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_JobApplications_JobApplicationId",
                table: "Notes",
                column: "JobApplicationId",
                principalTable: "JobApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}
