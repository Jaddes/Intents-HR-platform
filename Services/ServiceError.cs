namespace Intents_HR_platform.Services;

public sealed class ServiceError
{
    private ServiceError(string code, string message)
    {
        Code = code;
        Message = message;
    }

    public string Code { get; }

    public string Message { get; }

    public static ServiceError CandidateNotFound(int candidateId) =>
        new("CandidateNotFound", $"Candidate with id {candidateId} was not found.");

    public static ServiceError SkillNotFound(int skillId) =>
        new("SkillNotFound", $"Skill with id {skillId} was not found.");

    public static ServiceError DuplicateEmail(string email) =>
        new("DuplicateEmail", $"Candidate email '{email}' is already in use.");

    public static ServiceError DuplicateSkillName(string skillName) =>
        new("DuplicateSkillName", $"Skill name '{skillName}' already exists.");

    public static ServiceError SkillAlreadyAssigned(int candidateId, int skillId) =>
        new("SkillAlreadyAssigned", $"Skill with id {skillId} is already assigned to candidate with id {candidateId}.");
}
