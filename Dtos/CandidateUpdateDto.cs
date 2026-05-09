using System.ComponentModel.DataAnnotations;

namespace Intents_HR_platform.Dtos;

public class CandidateUpdateDto
{
    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required]
    [Phone]
    [MaxLength(30)]
    public string ContactNumber { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(320)]
    public string Email { get; set; } = string.Empty;
}
