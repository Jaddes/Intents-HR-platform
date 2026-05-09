namespace Intents_HR_platform.Dtos;

public class CandidateReadDto
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public DateOnly DateOfBirth { get; set; }

    public string ContactNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public ICollection<SkillReadDto> Skills { get; set; } = new List<SkillReadDto>();
}
