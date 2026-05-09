import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import type { Candidate, Skill } from '../types';
import { EmptyState } from '../components/EmptyState';

type CandidatesPageProps = {
  candidates: Candidate[];
  skills: Skill[];
  searchName: string;
  selectedSkillId: string;
  loading: boolean;
  onSearchNameChange: (value: string) => void;
  onSelectedSkillChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onCreateClick: () => void;
  onEditClick: (candidate: Candidate) => void;
  onDeleteClick: (candidateId: number) => void;
  onAssignSkillClick: (candidate: Candidate) => void;
  onRemoveSkill: (candidateId: number, skillId: number) => void;
};

export function CandidatesPage({
  candidates,
  skills,
  searchName,
  selectedSkillId,
  loading,
  onSearchNameChange,
  onSelectedSkillChange,
  onSearch,
  onClearSearch,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onAssignSkillClick,
  onRemoveSkill,
}: CandidatesPageProps) {
  return (
    <Stack spacing={3}>
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4">Candidates</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Search, edit, and maintain candidate skill profiles.
          </Typography>
        </Box>
        <Button
          startIcon={<PersonAddAltIcon />}
          variant="contained"
          onClick={onCreateClick}
          sx={{ flex: '0 0 auto', minHeight: 46, minWidth: 176, px: 2.5 }}
        >
          Add candidate
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'minmax(260px, 1fr) minmax(220px, 320px) auto auto' },
            }}
          >
            <TextField
              fullWidth
              label="Search by name"
              value={searchName}
              onChange={(event) => onSearchNameChange(event.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="skill-filter-label">Filter by skill</InputLabel>
              <Select
                label="Filter by skill"
                labelId="skill-filter-label"
                value={selectedSkillId}
                onChange={(event) => onSelectedSkillChange(event.target.value)}
              >
                <MenuItem value="">All skills</MenuItem>
                {skills.map((skill) => (
                  <MenuItem key={skill.id} value={skill.id.toString()}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              startIcon={<SearchIcon />}
              variant="contained"
              onClick={onSearch}
              sx={{ minHeight: 56, minWidth: 118, px: 2.5 }}
            >
              Search
            </Button>
            <Button
              color="inherit"
              onClick={onClearSearch}
              sx={{ minHeight: 56, minWidth: 96, px: 2.5 }}
            >
              Clear
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {candidates.length === 0 ? (
            <EmptyState
              description={loading ? 'Loading candidate records.' : 'Try a different search or add a new candidate.'}
              title={loading ? 'Loading candidates' : 'No candidates found'}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow hover key={candidate.id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>{candidate.fullName}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        Born {candidate.dateOfBirth}
                      </Typography>
                    </TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.contactNumber}</TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {candidate.skills.map((skill) => (
                          <Chip
                            key={skill.id}
                            label={skill.name}
                            onDelete={() => onRemoveSkill(candidate.id, skill.id)}
                            deleteIcon={<CancelIcon />}
                            size="small"
                          />
                        ))}
                        {candidate.skills.length === 0 ? (
                          <Typography color="text.secondary" variant="body2">
                            No skills assigned
                          </Typography>
                        ) : null}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Add skill">
                        <IconButton onClick={() => onAssignSkillClick(candidate)}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit candidate">
                        <IconButton onClick={() => onEditClick(candidate)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete candidate">
                        <IconButton color="error" onClick={() => onDeleteClick(candidate.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
