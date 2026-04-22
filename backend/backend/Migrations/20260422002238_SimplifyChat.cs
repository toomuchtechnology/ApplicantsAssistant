using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MessageMetadata");

            migrationBuilder.DropTable(
                name: "MessageSources");

            migrationBuilder.DropTable(
                name: "ToolCalls");

            migrationBuilder.DropTable(
                name: "AgentEvents");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_CreatedAt",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_UserId",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_ChatSessionId",
                table: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_ChatSessionId_Timestamp",
                table: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_Timestamp",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "CompletionTokens",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "CostUsd",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "IterationsCount",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "PromptTokens",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "ResponseTimeMs",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "Thinking",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "TotalTokens",
                table: "ChatMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Users_UserId",
                table: "ChatSessions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Users_UserId",
                table: "ChatSessions");

            migrationBuilder.AddColumn<int>(
                name: "CompletionTokens",
                table: "ChatMessages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CostUsd",
                table: "ChatMessages",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IterationsCount",
                table: "ChatMessages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PromptTokens",
                table: "ChatMessages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ResponseTimeMs",
                table: "ChatMessages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Thinking",
                table: "ChatMessages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TotalTokens",
                table: "ChatMessages",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AgentEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChatMessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    DurationMs = table.Column<int>(type: "integer", nullable: true),
                    ErrorMessage = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    EventData = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    EventType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    OrderNumber = table.Column<int>(type: "integer", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ToolName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgentEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AgentEvents_ChatMessages_ChatMessageId",
                        column: x => x.ChatMessageId,
                        principalTable: "ChatMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MessageMetadata",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChatMessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    AdditionalData = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    MaxIterations = table.Column<int>(type: "integer", nullable: true),
                    MaxTokens = table.Column<int>(type: "integer", nullable: true),
                    ModelName = table.Column<string>(type: "text", nullable: false),
                    SearchAlpha = table.Column<float>(type: "real", nullable: true),
                    SearchLimit = table.Column<int>(type: "integer", nullable: true),
                    Temperature = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageMetadata", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MessageMetadata_ChatMessages_ChatMessageId",
                        column: x => x.ChatMessageId,
                        principalTable: "ChatMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MessageSources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChatMessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    DocumentNumber = table.Column<int>(type: "integer", nullable: false),
                    Excerpt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Metadata = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    RelevanceScore = table.Column<float>(type: "real", nullable: false),
                    SourceId = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SourceName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SourceType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageSources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MessageSources_ChatMessages_ChatMessageId",
                        column: x => x.ChatMessageId,
                        principalTable: "ChatMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ToolCalls",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AgentEventId = table.Column<Guid>(type: "uuid", nullable: false),
                    DurationMs = table.Column<int>(type: "integer", nullable: false),
                    IsSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    Parameters = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    Result = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    ResultLength = table.Column<int>(type: "integer", nullable: true),
                    ResultPreview = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ToolName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToolCalls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToolCalls_AgentEvents_AgentEventId",
                        column: x => x.AgentEventId,
                        principalTable: "AgentEvents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_CreatedAt",
                table: "ChatSessions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_UserId",
                table: "ChatSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatSessionId",
                table: "ChatMessages",
                column: "ChatSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatSessionId_Timestamp",
                table: "ChatMessages",
                columns: new[] { "ChatSessionId", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_Timestamp",
                table: "ChatMessages",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_AgentEvents_ChatMessageId",
                table: "AgentEvents",
                column: "ChatMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_AgentEvents_ChatMessageId_OrderNumber",
                table: "AgentEvents",
                columns: new[] { "ChatMessageId", "OrderNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_AgentEvents_EventType",
                table: "AgentEvents",
                column: "EventType");

            migrationBuilder.CreateIndex(
                name: "IX_AgentEvents_Timestamp",
                table: "AgentEvents",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_MessageMetadata_ChatMessageId",
                table: "MessageMetadata",
                column: "ChatMessageId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MessageSources_ChatMessageId",
                table: "MessageSources",
                column: "ChatMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageSources_SourceId",
                table: "MessageSources",
                column: "SourceId");

            migrationBuilder.CreateIndex(
                name: "IX_ToolCalls_AgentEventId",
                table: "ToolCalls",
                column: "AgentEventId");
        }
    }
}
