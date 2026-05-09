using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Intents_HR_platform.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Candidates",
                columns: new[] { "Id", "ContactNumber", "DateOfBirth", "Email", "FullName" },
                values: new object[,]
                {
                    { 1, "+381601112223", new DateOnly(1998, 5, 14), "ana.petrovic@example.com", "Ana Petrovic" },
                    { 2, "+381602223334", new DateOnly(1996, 9, 22), "marko.jovanovic@example.com", "Marko Jovanovic" }
                });

            migrationBuilder.InsertData(
                table: "Skills",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "C#" },
                    { 2, "Java" },
                    { 3, "PostgreSQL" },
                    { 4, "English" }
                });

            migrationBuilder.InsertData(
                table: "CandidateSkills",
                columns: new[] { "CandidateId", "SkillId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 1, 4 },
                    { 2, 2 },
                    { 2, 3 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CandidateSkills",
                keyColumns: new[] { "CandidateId", "SkillId" },
                keyValues: new object[] { 1, 1 });

            migrationBuilder.DeleteData(
                table: "CandidateSkills",
                keyColumns: new[] { "CandidateId", "SkillId" },
                keyValues: new object[] { 1, 4 });

            migrationBuilder.DeleteData(
                table: "CandidateSkills",
                keyColumns: new[] { "CandidateId", "SkillId" },
                keyValues: new object[] { 2, 2 });

            migrationBuilder.DeleteData(
                table: "CandidateSkills",
                keyColumns: new[] { "CandidateId", "SkillId" },
                keyValues: new object[] { 2, 3 });

            migrationBuilder.DeleteData(
                table: "Candidates",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Candidates",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
