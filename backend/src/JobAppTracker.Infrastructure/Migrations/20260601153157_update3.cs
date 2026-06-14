using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobAppTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class update3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interviews_JobApplications_JobApplicationId",
                table: "Interviews"
            );

            migrationBuilder.RenameColumn(
                name: "JobApplicationId",
                table: "Interviews",
                newName: "JobAppId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Interviews_JobApplicationId",
                table: "Interviews",
                newName: "IX_Interviews_JobAppId"
            );

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "Interviews",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)"
            );

            migrationBuilder.AlterColumn<string>(
                name: "Feedback",
                table: "Interviews",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Interviews_JobApplications_JobAppId",
                table: "Interviews",
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
                name: "FK_Interviews_JobApplications_JobAppId",
                table: "Interviews"
            );

            migrationBuilder.RenameColumn(
                name: "JobAppId",
                table: "Interviews",
                newName: "JobApplicationId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Interviews_JobAppId",
                table: "Interviews",
                newName: "IX_Interviews_JobApplicationId"
            );

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "Interviews",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "Feedback",
                table: "Interviews",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Interviews_JobApplications_JobApplicationId",
                table: "Interviews",
                column: "JobApplicationId",
                principalTable: "JobApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}
