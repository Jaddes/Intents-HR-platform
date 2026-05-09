using Intents_HR_platform.Data;
using Intents_HR_platform.Dtos;
using Intents_HR_platform.Models;
using Microsoft.EntityFrameworkCore;

namespace Intents_HR_platform.Services;

public class SkillService(ApplicationDbContext dbContext) : ISkillService
{
    public async Task<ServiceResult<SkillReadDto>> AddSkillAsync(
        SkillCreateDto skillDto,
        CancellationToken cancellationToken = default)
    {
        var skillName = skillDto.Name.Trim();
        var normalizedSkillName = skillName.ToLower();

        var duplicateExists = await dbContext.Skills.AnyAsync(
            skill => skill.Name.ToLower() == normalizedSkillName,
            cancellationToken);

        if (duplicateExists)
        {
            return ServiceResult<SkillReadDto>.Failure(ServiceError.DuplicateSkillName(skillName));
        }

        var skill = new Skill
        {
            Name = skillName
        };

        dbContext.Skills.Add(skill);
        await dbContext.SaveChangesAsync(cancellationToken);

        return ServiceResult<SkillReadDto>.Success(MapSkill(skill));
    }

    public async Task<IReadOnlyCollection<SkillReadDto>> GetAllSkillsAsync(
        CancellationToken cancellationToken = default)
    {
        var skills = await dbContext.Skills
            .AsNoTracking()
            .OrderBy(skill => skill.Name)
            .ToListAsync(cancellationToken);

        return skills.Select(MapSkill).ToList();
    }

    private static SkillReadDto MapSkill(Skill skill) =>
        new()
        {
            Id = skill.Id,
            Name = skill.Name
        };
}
