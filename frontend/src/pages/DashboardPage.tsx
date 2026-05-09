import { Box, Card, CardContent, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import type { Candidate, Skill } from '../types';
import { StatCard } from '../components/StatCard';

type DashboardPageProps = {
  candidates: Candidate[];
  skills: Skill[];
};

export function DashboardPage({ candidates, skills }: DashboardPageProps) {
  const assignedSkillCount = candidates.reduce((total, candidate) => total + candidate.skills.length, 0);
  const averageSkills = candidates.length ? (assignedSkillCount / candidates.length).toFixed(1) : '0';

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Overview of candidates, skills, and current HR data coverage.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            color="#635bff"
            helper="Profiles available in the API"
            icon={<GroupsIcon />}
            title="TOTAL CANDIDATES"
            value={candidates.length.toString()}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            color="#10b981"
            helper="Reusable skill records"
            icon={<PsychologyIcon />}
            title="TOTAL SKILLS"
            value={skills.length.toString()}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            color="#f97316"
            helper="Average assigned skills"
            icon={<AssignmentTurnedInIcon />}
            title="PROFILE DEPTH"
            value={averageSkills}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Candidate skill coverage</Typography>
              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {candidates.map((candidate) => (
                  <Box key={candidate.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography sx={{ fontWeight: 700 }}>{candidate.fullName}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {candidate.skills.length} skills
                      </Typography>
                    </Box>
                    <LinearProgress
                      value={Math.min((candidate.skills.length / Math.max(skills.length, 1)) * 100, 100)}
                      variant="determinate"
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top skills</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {skills.slice(0, 6).map((skill) => (
                  <Box
                    key={skill.id}
                    sx={{
                      alignItems: 'center',
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1.25,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>{skill.name}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Skill #{skill.id}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
