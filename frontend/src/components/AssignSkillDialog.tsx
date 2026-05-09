import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import type { Candidate, Skill } from '../types';

type AssignSkillDialogProps = {
  open: boolean;
  candidate: Candidate | null;
  skills: Skill[];
  saving: boolean;
  onClose: () => void;
  onAssign: (candidateId: number, skillId: number) => Promise<void>;
};

export function AssignSkillDialog({
  open,
  candidate,
  skills,
  saving,
  onClose,
  onAssign,
}: AssignSkillDialogProps) {
  const [skillId, setSkillId] = useState('');

  const availableSkills = useMemo(() => {
    const assignedIds = new Set(candidate?.skills.map((skill) => skill.id) ?? []);
    return skills.filter((skill) => !assignedIds.has(skill.id));
  }, [candidate, skills]);

  useEffect(() => {
    setSkillId('');
  }, [open]);

  const handleAssign = async () => {
    if (!candidate || !skillId) {
      return;
    }

    await onAssign(candidate.id, Number(skillId));
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={saving ? undefined : onClose}>
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="h5">Add skill</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.75 }}>
          Assign a skill to {candidate?.fullName}.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="assign-skill-label">Skill</InputLabel>
          <Select
            label="Skill"
            labelId="assign-skill-label"
            value={skillId}
            onChange={(event) => setSkillId(event.target.value)}
          >
            {availableSkills.map((skill) => (
              <MenuItem key={skill.id} value={skill.id.toString()}>
                {skill.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3, pt: 2 }}>
        <Button color="inherit" disabled={saving} onClick={onClose} sx={{ minHeight: 42, minWidth: 96 }}>
          Cancel
        </Button>
        <Button
          disabled={saving || !skillId}
          variant="contained"
          onClick={handleAssign}
          sx={{ minHeight: 42, minWidth: 118 }}
        >
          Add skill
        </Button>
      </DialogActions>
    </Dialog>
  );
}
