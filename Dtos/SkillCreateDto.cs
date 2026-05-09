using System.ComponentModel.DataAnnotations;

namespace Intents_HR_platform.Dtos;

public class SkillCreateDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
