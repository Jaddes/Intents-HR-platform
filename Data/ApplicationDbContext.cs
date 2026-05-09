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
    }
}
