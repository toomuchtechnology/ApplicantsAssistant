using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateChatSessionDto
{
    [MaxLength(200)]
    public string? Title { get; set; }
 
    [Required]
    [MaxLength(50)]
    public string Mode { get; set; }
 
    [MaxLength(100)]
    public string? Model { get; set; }
}