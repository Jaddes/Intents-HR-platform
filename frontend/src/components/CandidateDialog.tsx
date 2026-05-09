import { useEffect, useState } from 'react';
import {
  Box,
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
    if (
      !form.fullName.trim()
      || !form.dateOfBirth
      || !form.contactNumber.trim()
      || !form.email.trim()
    ) {
      return;
    }

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
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="h5">{candidate ? 'Edit candidate' : 'Add candidate'}</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.75 }}>
          {candidate ? 'Update the candidate profile details.' : 'Create a candidate profile and assign initial skills.'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2 }}>
        <Stack spacing={2.25}>
          <TextField
            autoFocus
            fullWidth
            required
            label="Full name"
            placeholder="Ana Petrovic"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
          <Box>
            <Typography color="text.secondary" sx={{ fontWeight: 700, mb: 0.75 }} variant="body2">
              Date of birth *
            </Typography>
            <TextField
              fullWidth
              required
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
            />
          </Box>
          <TextField
            fullWidth
            required
            label="Contact number"
            placeholder="+381601112223"
            value={form.contactNumber}
            onChange={(event) => setForm({ ...form, contactNumber: event.target.value })}
          />
          <TextField
            fullWidth
            required
            type="email"
            label="Email"
            placeholder="candidate@example.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          {!candidate ? (
            <Box>
              <Typography color="text.secondary" sx={{ fontWeight: 700 }} variant="body2">
                Initial skills
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 0.5,
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  mt: 1,
                }}
              >
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
                    sx={{
                      border: '1px solid',
                      borderColor: form.skillIds.includes(skill.id) ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      m: 0,
                      px: 1,
                      py: 0.25,
                      bgcolor: form.skillIds.includes(skill.id) ? 'rgba(99, 91, 255, 0.06)' : 'transparent',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3, pt: 2 }}>
        <Button
          color="inherit"
          disabled={saving}
          onClick={onClose}
          sx={{ minHeight: 42, minWidth: 96 }}
        >
          Cancel
        </Button>
        <Button
          disabled={
            saving
            || !form.fullName.trim()
            || !form.dateOfBirth
            || !form.contactNumber.trim()
            || !form.email.trim()
          }
          variant="contained"
          onClick={handleSubmit}
          sx={{ minHeight: 42, minWidth: 156 }}
        >
          {candidate ? 'Save changes' : 'Create candidate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
