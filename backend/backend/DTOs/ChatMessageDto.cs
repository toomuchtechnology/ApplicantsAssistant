namespace backend.DTOs;

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public string Role { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public int OrderNumber { get; set; }
}