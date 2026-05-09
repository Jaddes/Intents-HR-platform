using Intents_HR_platform.Dtos;

namespace Intents_HR_platform.Services;

public interface ICandidateService
{
    Task<ServiceResult<CandidateReadDto>> AddCandidateAsync(CandidateCreateDto candidateDto, CancellationToken cancellationToken = default);

    Task<ServiceResult<CandidateReadDto>> UpdateCandidateAsync(int candidateId, CandidateUpdateDto candidateDto, CancellationToken cancellationToken = default);

    Task<ServiceResult<bool>> RemoveCandidateAsync(int candidateId, CancellationToken cancellationToken = default);

    Task<ServiceResult<CandidateReadDto>> AddSkillToCandidateAsync(int candidateId, int skillId, CancellationToken cancellationToken = default);

    Task<ServiceResult<CandidateReadDto>> RemoveSkillFromCandidateAsync(int candidateId, int skillId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<CandidateReadDto>> SearchCandidatesAsync(CandidateSearchDto searchDto, CancellationToken cancellationToken = default);

    Task<ServiceResult<CandidateReadDto>> GetCandidateByIdAsync(int candidateId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<CandidateReadDto>> GetAllCandidatesAsync(CancellationToken cancellationToken = default);
}
