import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Skill } from '../types';
import { EmptyState } from '../components/EmptyState';

type SkillsPageProps = {
  skills: Skill[];
  loading: boolean;
  onCreateClick: () => void;
};

export function SkillsPage({ skills, loading, onCreateClick }: SkillsPageProps) {
  return (
    <Stack spacing={3}>
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4">Skills</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Maintain the reusable skill catalog for candidate profiles.
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={onCreateClick}
          sx={{ flex: '0 0 auto', minHeight: 46, minWidth: 138, px: 2.5 }}
        >
          Add skill
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {skills.length === 0 ? (
            <EmptyState
              description={loading ? 'Loading skill records.' : 'Create a skill to start building candidate profiles.'}
              title={loading ? 'Loading skills' : 'No skills found'}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Skill</TableCell>
                  <TableCell>Identifier</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow hover key={skill.id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>{skill.name}</Typography>
                    </TableCell>
                    <TableCell>#{skill.id}</TableCell>
                    <TableCell>
                      <Chip color="success" label="Available" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
