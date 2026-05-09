using Intents_HR_platform.Dtos;
using Intents_HR_platform.Services;
using Microsoft.AspNetCore.Mvc;

namespace Intents_HR_platform.Controllers;

[ApiController]
[Route("api/candidates")]
public class CandidatesController(ICandidateService candidateService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<CandidateReadDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<CandidateReadDto>>> GetAllCandidates(
        CancellationToken cancellationToken)
    {
        var candidates = await candidateService.GetAllCandidatesAsync(cancellationToken);
        return Ok(candidates);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CandidateReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CandidateReadDto>> GetCandidateById(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await candidateService.GetCandidateByIdAsync(id, cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(CandidateReadDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CandidateReadDto>> CreateCandidate(
        CandidateCreateDto candidateDto,
        CancellationToken cancellationToken)
    {
        var result = await candidateService.AddCandidateAsync(candidateDto, cancellationToken);
        if (!result.Succeeded)
        {
            return ToActionResult(result);
        }

        return CreatedAtAction(
            nameof(GetCandidateById),
            new
            {
                id = result.Value!.Id
            },
            result.Value);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(CandidateReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CandidateReadDto>> UpdateCandidate(
        int id,
        CandidateUpdateDto candidateDto,
        CancellationToken cancellationToken)
    {
        var result = await candidateService.UpdateCandidateAsync(id, candidateDto, cancellationToken);
        return ToActionResult(result);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCandidate(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await candidateService.RemoveCandidateAsync(id, cancellationToken);
        if (!result.Succeeded)
        {
            return ToErrorResult(result.Error!);
        }

        return NoContent();
    }

    [HttpPost("{candidateId:int}/skills/{skillId:int}")]
    [ProducesResponseType(typeof(CandidateReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CandidateReadDto>> AddSkillToCandidate(
        int candidateId,
        int skillId,
        CancellationToken cancellationToken)
    {
        var result = await candidateService.AddSkillToCandidateAsync(candidateId, skillId, cancellationToken);
        return ToActionResult(result);
    }

    [HttpDelete("{candidateId:int}/skills/{skillId:int}")]
    [ProducesResponseType(typeof(CandidateReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CandidateReadDto>> RemoveSkillFromCandidate(
        int candidateId,
        int skillId,
        CancellationToken cancellationToken)
    {
        var result = await candidateService.RemoveSkillFromCandidateAsync(candidateId, skillId, cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(IReadOnlyCollection<CandidateReadDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<CandidateReadDto>>> SearchCandidates(
        [FromQuery] string? name,
        [FromQuery] List<int>? skillIds,
        [FromQuery] List<string>? skillNames,
        CancellationToken cancellationToken)
    {
        var searchDto = new CandidateSearchDto
        {
            Name = name,
            SkillIds = skillIds ?? new List<int>(),
            SkillNames = skillNames ?? new List<string>()
        };

        var candidates = await candidateService.SearchCandidatesAsync(searchDto, cancellationToken);
        return Ok(candidates);
    }

    private ActionResult<T> ToActionResult<T>(ServiceResult<T> result)
    {
        if (result.Succeeded)
        {
            return Ok(result.Value);
        }

        return ToErrorResult(result.Error!);
    }

    private ObjectResult ToErrorResult(ServiceError error) =>
        error.Code switch
        {
            "CandidateNotFound" or "SkillNotFound" => NotFound(error),
            "DuplicateEmail" or "DuplicateSkillName" or "SkillAlreadyAssigned" => Conflict(error),
            _ => BadRequest(error)
        };
}
