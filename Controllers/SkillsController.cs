using Intents_HR_platform.Dtos;
using Intents_HR_platform.Services;
using Microsoft.AspNetCore.Mvc;

namespace Intents_HR_platform.Controllers;

[ApiController]
[Route("api/skills")]
public class SkillsController(ISkillService skillService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<SkillReadDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<SkillReadDto>>> GetAllSkills(
        CancellationToken cancellationToken)
    {
        var skills = await skillService.GetAllSkillsAsync(cancellationToken);
        return Ok(skills);
    }

    [HttpPost]
    [ProducesResponseType(typeof(SkillReadDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ServiceError), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SkillReadDto>> CreateSkill(
        SkillCreateDto skillDto,
        CancellationToken cancellationToken)
    {
        var result = await skillService.AddSkillAsync(skillDto, cancellationToken);
        if (!result.Succeeded)
        {
            return ToErrorResult(result.Error!);
        }

        return CreatedAtAction(nameof(GetAllSkills), result.Value);
    }

    private ObjectResult ToErrorResult(ServiceError error) =>
        error.Code switch
        {
            "DuplicateSkillName" => Conflict(error),
            _ => BadRequest(error)
        };
}
