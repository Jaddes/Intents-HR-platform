using System.ComponentModel.DataAnnotations;

namespace Intents_HR_platform.Models;

public class Candidate
{
    public int Id { get; set; }

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

    public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
}
