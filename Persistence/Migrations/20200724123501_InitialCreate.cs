using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Company = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    DateAdded = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Objectives",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Category = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Assignation = table.Column<string>(nullable: true),
                    Deadline = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Objectives", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Stocks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    Count = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stocks", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "Count", "Name" },
                values: new object[] { 1, 1, "steel1" });

            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "Count", "Name" },
                values: new object[] { 2, 4, "steel2" });

            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "Count", "Name" },
                values: new object[] { 3, 3, "steel3" });

            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "Count", "Name" },
                values: new object[] { 4, 6, "steel4" });

            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "Count", "Name" },
                values: new object[] { 5, 5, "steel5" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "Objectives");

            migrationBuilder.DropTable(
                name: "Stocks");
        }
    }
}
