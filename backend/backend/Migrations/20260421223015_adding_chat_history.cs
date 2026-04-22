using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class adding_chat_history : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChatSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Mode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Model = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatSessions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChatSessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Thinking = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    OrderNumber = table.Column<int>(type: "integer", nullable: false),
                    PromptTokens = table.Column<int>(type: "integer", nullable: true),
                    CompletionTokens = table.Column<int>(type: "integer", nullable: true),
                    TotalTokens = table.Column<int>(type: "integer", nullable: true),
                    CostUsd = table.Column<decimal>(type: "numeric", nullable: true),
                    ResponseTimeMs = table.Column<int>(type: "integer", nullable: true),
                    IterationsCount = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatSessions_ChatSessionId",
                        column: x => x.ChatSessionId,
                        principalTable: "ChatSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AgentEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChatMessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    EventType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    OrderNumber = table.Column<int>(type: "integer", nullable: false),
                    ToolName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EventData = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    ErrorMessage = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DurationMs = table.Column<int>(type: "integer", nullable: true)
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
                    ModelName = table.Column<string>(type: "text", nullable: false),
                    Temperature = table.Column<float>(type: "real", nullable: true),
                    MaxTokens = table.Column<int>(type: "integer", nullable: true),
                    MaxIterations = table.Column<int>(type: "integer", nullable: true),
                    SearchLimit = table.Column<int>(type: "integer", nullable: true),
                    SearchAlpha = table.Column<float>(type: "real", nullable: true),
                    AdditionalData = table.Column<JsonDocument>(type: "jsonb", nullable: false)
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
                    SourceId = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SourceName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SourceType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RelevanceScore = table.Column<float>(type: "real", nullable: false),
                    Excerpt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DocumentNumber = table.Column<int>(type: "integer", nullable: false),
                    Metadata = table.Column<JsonDocument>(type: "jsonb", nullable: false)
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
                    ToolName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Parameters = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    Result = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    ResultPreview = table.Column<string>(type: "text", nullable: false),
                    ResultLength = table.Column<int>(type: "integer", nullable: true),
                    IsSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    DurationMs = table.Column<int>(type: "integer", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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
                name: "IX_ChatMessages_ChatSessionId",
                table: "ChatMessages",
                column: "ChatSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatSessionId_OrderNumber",
                table: "ChatMessages",
                columns: new[] { "ChatSessionId", "OrderNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatSessionId_Timestamp",
                table: "ChatMessages",
                columns: new[] { "ChatSessionId", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_Timestamp",
                table: "ChatMessages",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_CreatedAt",
                table: "ChatSessions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_UserId",
                table: "ChatSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_UserId_IsActive",
                table: "ChatSessions",
                columns: new[] { "UserId", "IsActive" });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MessageMetadata");

            migrationBuilder.DropTable(
                name: "MessageSources");

            migrationBuilder.DropTable(
                name: "ToolCalls");

            migrationBuilder.DropTable(
                name: "AgentEvents");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "ChatSessions");
        }
    }
}
