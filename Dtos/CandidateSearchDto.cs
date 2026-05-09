namespace Intents_HR_platform.Dtos;

public class CandidateSearchDto
{
    public string? Name { get; set; }

    public ICollection<int> SkillIds { get; set; } = new List<int>();

    public ICollection<string> SkillNames { get; set; } = new List<string>();
}
