using Intents_HR_platform.Models;
using Microsoft.EntityFrameworkCore;

namespace Intents_HR_platform.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Candidate> Candidates => Set<Candidate>();

    public DbSet<Skill> Skills => Set<Skill>();

    public DbSet<CandidateSkill> CandidateSkills => Set<CandidateSkill>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasIndex(candidate => candidate.Email)
                .IsUnique();
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasIndex(skill => skill.Name)
                .IsUnique();
        });

        modelBuilder.Entity<CandidateSkill>(entity =>
        {
            entity.HasKey(candidateSkill => new
            {
                candidateSkill.CandidateId,
                candidateSkill.SkillId
            });

            entity.HasOne(candidateSkill => candidateSkill.Candidate)
                .WithMany(candidate => candidate.CandidateSkills)
                .HasForeignKey(candidateSkill => candidateSkill.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(candidateSkill => candidateSkill.Skill)
                .WithMany(skill => skill.CandidateSkills)
                .HasForeignKey(candidateSkill => candidateSkill.SkillId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Candidate>().HasData(
            new Candidate
            {
                Id = 1,
                FullName = "Ana Petrovic",
                DateOfBirth = new DateOnly(1998, 5, 14),
                ContactNumber = "+381601112223",
                Email = "ana.petrovic@example.com"
            },
            new Candidate
            {
                Id = 2,
                FullName = "Marko Jovanovic",
                DateOfBirth = new DateOnly(1996, 9, 22),
                ContactNumber = "+381602223334",
                Email = "marko.jovanovic@example.com"
            });

        modelBuilder.Entity<Skill>().HasData(
            new Skill
            {
                Id = 1,
                Name = "C#"
            },
            new Skill
            {
                Id = 2,
                Name = "Java"
            },
            new Skill
            {
                Id = 3,
                Name = "PostgreSQL"
            },
            new Skill
            {
                Id = 4,
                Name = "English"
            });

        modelBuilder.Entity<CandidateSkill>().HasData(
            new CandidateSkill
            {
                CandidateId = 1,
                SkillId = 1
            },
            new CandidateSkill
            {
                CandidateId = 1,
                SkillId = 4
            },
            new CandidateSkill
            {
                CandidateId = 2,
                SkillId = 2
            },
            new CandidateSkill
            {
                CandidateId = 2,
                SkillId = 3
            });
    }
}
