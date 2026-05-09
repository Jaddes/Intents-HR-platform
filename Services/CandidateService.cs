using Intents_HR_platform.Data;
using Intents_HR_platform.Dtos;
using Intents_HR_platform.Models;
using Microsoft.EntityFrameworkCore;

namespace Intents_HR_platform.Services;

public class CandidateService(ApplicationDbContext dbContext) : ICandidateService
{
    public async Task<ServiceResult<CandidateReadDto>> AddCandidateAsync(
        CandidateCreateDto candidateDto,
        CancellationToken cancellationToken = default)
    {
        var email = candidateDto.Email.Trim();

        if (await EmailExistsAsync(email, null, cancellationToken))
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.DuplicateEmail(email));
        }

        var skillIds = candidateDto.SkillIds.Distinct().ToList();
        var existingSkillIds = await dbContext.Skills
            .Where(skill => skillIds.Contains(skill.Id))
            .Select(skill => skill.Id)
            .ToListAsync(cancellationToken);

        var missingSkillId = skillIds.Except(existingSkillIds).Cast<int?>().FirstOrDefault();
        if (missingSkillId.HasValue)
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.SkillNotFound(missingSkillId.Value));
        }

        var candidate = new Candidate
        {
            FullName = candidateDto.FullName.Trim(),
            DateOfBirth = candidateDto.DateOfBirth,
            ContactNumber = candidateDto.ContactNumber.Trim(),
            Email = email,
            CandidateSkills = skillIds
                .Select(skillId => new CandidateSkill
                {
                    SkillId = skillId
                })
                .ToList()
        };

        dbContext.Candidates.Add(candidate);
        await dbContext.SaveChangesAsync(cancellationToken);

        var createdCandidate = await GetCandidateEntityByIdAsync(candidate.Id, cancellationToken);
        return ServiceResult<CandidateReadDto>.Success(MapCandidate(createdCandidate!));
    }

    public async Task<ServiceResult<CandidateReadDto>> UpdateCandidateAsync(
        int candidateId,
        CandidateUpdateDto candidateDto,
        CancellationToken cancellationToken = default)
    {
        var candidate = await dbContext.Candidates
            .FirstOrDefaultAsync(candidate => candidate.Id == candidateId, cancellationToken);

        if (candidate is null)
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.CandidateNotFound(candidateId));
        }

        var email = candidateDto.Email.Trim();
        if (await EmailExistsAsync(email, candidateId, cancellationToken))
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.DuplicateEmail(email));
        }

        candidate.FullName = candidateDto.FullName.Trim();
        candidate.DateOfBirth = candidateDto.DateOfBirth;
        candidate.ContactNumber = candidateDto.ContactNumber.Trim();
        candidate.Email = email;

        await dbContext.SaveChangesAsync(cancellationToken);

        var updatedCandidate = await GetCandidateEntityByIdAsync(candidateId, cancellationToken);
        return ServiceResult<CandidateReadDto>.Success(MapCandidate(updatedCandidate!));
    }

    public async Task<ServiceResult<bool>> RemoveCandidateAsync(
        int candidateId,
        CancellationToken cancellationToken = default)
    {
        var candidate = await dbContext.Candidates
            .FirstOrDefaultAsync(candidate => candidate.Id == candidateId, cancellationToken);

        if (candidate is null)
        {
            return ServiceResult<bool>.Failure(ServiceError.CandidateNotFound(candidateId));
        }

        dbContext.Candidates.Remove(candidate);
        await dbContext.SaveChangesAsync(cancellationToken);

        return ServiceResult<bool>.Success(true);
    }

    public async Task<ServiceResult<CandidateReadDto>> AddSkillToCandidateAsync(
        int candidateId,
        int skillId,
        CancellationToken cancellationToken = default)
    {
        if (!await dbContext.Candidates.AnyAsync(candidate => candidate.Id == candidateId, cancellationToken))
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.CandidateNotFound(candidateId));
        }

        if (!await dbContext.Skills.AnyAsync(skill => skill.Id == skillId, cancellationToken))
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.SkillNotFound(skillId));
        }

        var alreadyAssigned = await dbContext.CandidateSkills.AnyAsync(
            candidateSkill => candidateSkill.CandidateId == candidateId && candidateSkill.SkillId == skillId,
            cancellationToken);

        if (alreadyAssigned)
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.SkillAlreadyAssigned(candidateId, skillId));
        }

        dbContext.CandidateSkills.Add(new CandidateSkill
        {
            CandidateId = candidateId,
            SkillId = skillId
        });

        await dbContext.SaveChangesAsync(cancellationToken);

        var candidate = await GetCandidateEntityByIdAsync(candidateId, cancellationToken);
        return ServiceResult<CandidateReadDto>.Success(MapCandidate(candidate!));
    }

    public async Task<ServiceResult<CandidateReadDto>> RemoveSkillFromCandidateAsync(
        int candidateId,
        int skillId,
        CancellationToken cancellationToken = default)
    {
        if (!await dbContext.Candidates.AnyAsync(candidate => candidate.Id == candidateId, cancellationToken))
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.CandidateNotFound(candidateId));
        }

        if (!await dbContext.Skills.AnyAsync(skill => skill.Id == skillId, cancellationToken))
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.SkillNotFound(skillId));
        }

        var candidateSkill = await dbContext.CandidateSkills.FirstOrDefaultAsync(
            candidateSkill => candidateSkill.CandidateId == candidateId && candidateSkill.SkillId == skillId,
            cancellationToken);

        if (candidateSkill is not null)
        {
            dbContext.CandidateSkills.Remove(candidateSkill);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        var candidate = await GetCandidateEntityByIdAsync(candidateId, cancellationToken);
        return ServiceResult<CandidateReadDto>.Success(MapCandidate(candidate!));
    }

    public async Task<IReadOnlyCollection<CandidateReadDto>> SearchCandidatesAsync(
        CandidateSearchDto searchDto,
        CancellationToken cancellationToken = default)
    {
        var query = CandidateReadQuery();

        if (!string.IsNullOrWhiteSpace(searchDto.Name))
        {
            var namePattern = $"%{searchDto.Name.Trim()}%";
            query = query.Where(candidate => EF.Functions.ILike(candidate.FullName, namePattern));
        }

        var skillIds = searchDto.SkillIds.Distinct().ToList();
        foreach (var skillId in skillIds)
        {
            query = query.Where(candidate =>
                candidate.CandidateSkills.Any(candidateSkill => candidateSkill.SkillId == skillId));
        }

        var skillNames = searchDto.SkillNames
            .Where(skillName => !string.IsNullOrWhiteSpace(skillName))
            .Select(skillName => skillName.Trim().ToLower())
            .Distinct()
            .ToList();

        foreach (var skillName in skillNames)
        {
            query = query.Where(candidate =>
                candidate.CandidateSkills.Any(candidateSkill => candidateSkill.Skill.Name.ToLower() == skillName));
        }

        var candidates = await query
            .OrderBy(candidate => candidate.FullName)
            .ToListAsync(cancellationToken);

        return candidates.Select(MapCandidate).ToList();
    }

    public async Task<ServiceResult<CandidateReadDto>> GetCandidateByIdAsync(
        int candidateId,
        CancellationToken cancellationToken = default)
    {
        var candidate = await GetCandidateEntityByIdAsync(candidateId, cancellationToken);
        if (candidate is null)
        {
            return ServiceResult<CandidateReadDto>.Failure(ServiceError.CandidateNotFound(candidateId));
        }

        return ServiceResult<CandidateReadDto>.Success(MapCandidate(candidate));
    }

    public async Task<IReadOnlyCollection<CandidateReadDto>> GetAllCandidatesAsync(
        CancellationToken cancellationToken = default)
    {
        var candidates = await CandidateReadQuery()
            .OrderBy(candidate => candidate.FullName)
            .ToListAsync(cancellationToken);

        return candidates.Select(MapCandidate).ToList();
    }

    private Task<bool> EmailExistsAsync(string email, int? excludedCandidateId, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.ToLower();

        return dbContext.Candidates.AnyAsync(
            candidate => candidate.Email.ToLower() == normalizedEmail
                && (!excludedCandidateId.HasValue || candidate.Id != excludedCandidateId.Value),
            cancellationToken);
    }

    private Task<Candidate?> GetCandidateEntityByIdAsync(int candidateId, CancellationToken cancellationToken) =>
        CandidateReadQuery()
            .FirstOrDefaultAsync(candidate => candidate.Id == candidateId, cancellationToken);

    private IQueryable<Candidate> CandidateReadQuery() =>
        dbContext.Candidates
            .AsNoTracking()
            .Include(candidate => candidate.CandidateSkills)
            .ThenInclude(candidateSkill => candidateSkill.Skill);

    private static CandidateReadDto MapCandidate(Candidate candidate) =>
        new()
        {
            Id = candidate.Id,
            FullName = candidate.FullName,
            DateOfBirth = candidate.DateOfBirth,
            ContactNumber = candidate.ContactNumber,
            Email = candidate.Email,
            Skills = candidate.CandidateSkills
                .OrderBy(candidateSkill => candidateSkill.Skill.Name)
                .Select(candidateSkill => MapSkill(candidateSkill.Skill))
                .ToList()
        };

    private static SkillReadDto MapSkill(Skill skill) =>
        new()
        {
            Id = skill.Id,
            Name = skill.Name
        };
}
