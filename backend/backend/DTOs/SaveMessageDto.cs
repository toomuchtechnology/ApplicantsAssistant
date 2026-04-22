using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class SaveMessageDto
{
    [Required]
    public Guid ChatSessionId { get; set; }
 
    [Required]
    [MaxLength(20)]
    public string Role { get; set; }
 
    /// <summary>
    /// Full message object serialized as a JSON string by the client.
    /// </summary>
    [Required]
    public string Content { get; set; }
}