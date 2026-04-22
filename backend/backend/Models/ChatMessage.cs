using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class ChatMessage
{
    [Key]
    public Guid Id { get; set; }
 
    [Required]
    public Guid ChatSessionId { get; set; }
 
    [Required]
    [MaxLength(20)]
    public string Role { get; set; }
 
    /// <summary>
    /// The full message object serialized as a JSON string.
    /// Deserialize on the client with JSON.parse(content).
    /// </summary>
    [Required]
    public string Content { get; set; }
 
    public DateTime Timestamp { get; set; }
 
    public int OrderNumber { get; set; }
 
    // Navigation
    public virtual ChatSession ChatSession { get; set; }
}