using System.ComponentModel.DataAnnotations;

namespace Intents_HR_platform.Models;

public class Skill
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
}
