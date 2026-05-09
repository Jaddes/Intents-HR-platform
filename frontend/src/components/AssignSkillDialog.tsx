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
      <DialogTitle>Add skill to {candidate?.fullName}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
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
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button color="inherit" disabled={saving} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={saving || !skillId} variant="contained" onClick={handleAssign}>
          Add skill
        </Button>
      </DialogActions>
    </Dialog>
  );
}
