using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class UpdateSessionTitleDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
}