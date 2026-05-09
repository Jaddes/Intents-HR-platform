using Intents_HR_platform.Dtos;

namespace Intents_HR_platform.Services;

public interface ISkillService
{
    Task<ServiceResult<SkillReadDto>> AddSkillAsync(SkillCreateDto skillDto, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<SkillReadDto>> GetAllSkillsAsync(CancellationToken cancellationToken = default);
}
