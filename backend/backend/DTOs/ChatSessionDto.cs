namespace backend.DTOs;

public class ChatSessionDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Mode { get; set; }
    public string? Model { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int MessageCount { get; set; }
}