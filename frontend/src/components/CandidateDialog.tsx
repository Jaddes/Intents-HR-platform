import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Candidate, CandidateCreateRequest, CandidateUpdateRequest, Skill } from '../types';

type CandidateDialogProps = {
  open: boolean;
  candidate: Candidate | null;
  skills: Skill[];
  saving: boolean;
  onClose: () => void;
  onCreate: (payload: CandidateCreateRequest) => Promise<void>;
  onUpdate: (candidateId: number, payload: CandidateUpdateRequest) => Promise<void>;
};

const emptyForm = {
  fullName: '',
  dateOfBirth: '',
  contactNumber: '',
  email: '',
  skillIds: [] as number[],
};

export function CandidateDialog({
  open,
  candidate,
  skills,
  saving,
  onClose,
  onCreate,
  onUpdate,
}: CandidateDialogProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (candidate) {
      setForm({
        fullName: candidate.fullName,
        dateOfBirth: candidate.dateOfBirth,
        contactNumber: candidate.contactNumber,
        email: candidate.email,
        skillIds: candidate.skills.map((skill) => skill.id),
      });
      return;
    }

    setForm(emptyForm);
  }, [candidate, open]);

  const handleSubmit = async () => {
    if (candidate) {
      await onUpdate(candidate.id, {
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        contactNumber: form.contactNumber,
        email: form.email,
      });
      return;
    }

    await onCreate(form);
  };

  const toggleSkill = (skillId: number) => {
    setForm((current) => ({
      ...current,
      skillIds: current.skillIds.includes(skillId)
        ? current.skillIds.filter((id) => id !== skillId)
        : [...current.skillIds, skillId],
    }));
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={saving ? undefined : onClose}>
      <DialogTitle>{candidate ? 'Edit candidate' : 'Add candidate'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            required
            label="Full name"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
          <TextField
            required
            type="date"
            label="Date of birth"
            value={form.dateOfBirth}
            InputLabelProps={{ shrink: true }}
            onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
          />
          <TextField
            required
            label="Contact number"
            value={form.contactNumber}
            onChange={(event) => setForm({ ...form, contactNumber: event.target.value })}
          />
          <TextField
            required
            type="email"
            label="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          {!candidate ? (
            <Stack>
              <Typography color="text.secondary" sx={{ fontWeight: 700 }} variant="body2">
                Initial skills
              </Typography>
              {skills.map((skill) => (
                <FormControlLabel
                  key={skill.id}
                  control={
                    <Checkbox
                      checked={form.skillIds.includes(skill.id)}
                      onChange={() => toggleSkill(skill.id)}
                    />
                  }
                  label={skill.name}
                />
              ))}
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button color="inherit" disabled={saving} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={saving} variant="contained" onClick={handleSubmit}>
          {candidate ? 'Save changes' : 'Create candidate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
