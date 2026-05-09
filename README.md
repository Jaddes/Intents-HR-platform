# Intents HR Platform

ASP.NET Core .NET 8 Web API for managing HR job candidates and their skills.

The application stores candidates, skills, and candidate-skill assignments in PostgreSQL. It exposes REST endpoints through controllers, uses DTOs at the API boundary, and keeps business operations inside a service layer.

## Technologies Used

- ASP.NET Core .NET 8
- Entity Framework Core 8
- PostgreSQL
- Npgsql Entity Framework Core provider
- Swagger / Swashbuckle
- C# nullable reference types

## Project Structure

- `Models/` - EF Core entity models
- `Data/` - `ApplicationDbContext` and EF configuration
- `Dtos/` - request and response DTOs
- `Services/` - business logic and service interfaces
- `Controllers/` - REST API controllers
- `Migrations/` - EF Core database migrations

## PostgreSQL Setup

The application expects a PostgreSQL database connection named `DefaultConnection` in `appsettings.json`.

Current local development connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=intents_hr_platform;Username=postgres;Password=postgres"
}
```

Adjust `Username` and `Password` if your local PostgreSQL credentials are different.

## How To Run

Restore and build the project:

```powershell
dotnet restore
dotnet build
```

Apply migrations:

```powershell
dotnet ef database update
```

Run the API:

```powershell
dotnet run
```

Swagger is available in Development mode at:

```text
http://localhost:5121/swagger
```

## Migration Commands

Create a migration:

```powershell
dotnet ef migrations add MigrationName
```

Apply migrations:

```powershell
dotnet ef database update
```

List migrations:

```powershell
dotnet ef migrations list
```

## API Endpoints

### Candidates

```text
GET    /api/candidates
GET    /api/candidates/{id}
POST   /api/candidates
PUT    /api/candidates/{id}
DELETE /api/candidates/{id}
POST   /api/candidates/{candidateId}/skills/{skillId}
DELETE /api/candidates/{candidateId}/skills/{skillId}
GET    /api/candidates/search?name=&skillIds=&skillNames=
```

### Skills

```text
GET  /api/skills
POST /api/skills
```

## Seed Data

The database is seeded through `HasData(...)` in `ApplicationDbContext`.

Initial candidates:

- Ana Petrovic
- Marko Jovanovic

Initial skills:

- C#
- Java
- PostgreSQL
- English

Initial candidate-skill assignments:

- Ana Petrovic -> C#, English
- Marko Jovanovic -> Java, PostgreSQL

## Validation And Error Handling

The API validates request DTOs through data annotations and `[ApiController]` behavior.

Handled cases include:

- Duplicate candidate email
- Duplicate skill name
- Candidate not found
- Skill not found
- Skill already assigned to candidate
- Empty required fields
- Invalid email and phone formats

Service errors are mapped to HTTP responses:

- `400 BadRequest`
- `404 NotFound`
- `409 Conflict`

Successful operations return:

- `200 OK`
- `201 Created`
- `204 NoContent`

## Architectural Decisions

The project uses DTOs instead of exposing EF Core entities directly from the API. This keeps persistence models separate from request and response contracts.

Controllers depend on service interfaces rather than `ApplicationDbContext`. This keeps HTTP concerns in controllers and business logic in services.

The many-to-many relationship between candidates and skills is represented explicitly through `CandidateSkill`. This allows EF Core to enforce a composite key and prevents duplicate candidate-skill pairs.

Database uniqueness is enforced at the EF/database level for candidate email and skill name, while services also perform clear pre-checks so callers receive useful errors.

## Most Interesting Implementation Detail

The most important part was keeping candidate-skill assignment logic consistent across EF Core, services, and API responses. The composite key prevents duplicate assignments in the database, while the service layer detects the same case before saving and returns a clear `SkillAlreadyAssigned` conflict response.

## Final Verification

The API was tested through the running Swagger-enabled application using real HTTP requests.

Verified operations:

- Create candidate
- Get all candidates
- Get candidate by id
- Update candidate
- Delete candidate
- Add skill to candidate
- Remove skill from candidate
- Search candidates
- Create skill
- Get all skills

Verified response cases:

- `200 OK`
- `201 Created`
- `204 NoContent`
- `400 BadRequest`
- `404 NotFound`
- `409 Conflict`

Final build command:

```powershell
dotnet build
```

Expected result:

```text
Build succeeded.
0 Warning(s)
0 Error(s)
```
