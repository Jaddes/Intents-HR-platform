import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import type { SkillCreateRequest } from '../types';

type SkillDialogProps = {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onCreate: (payload: SkillCreateRequest) => Promise<void>;
};

export function SkillDialog({ open, saving, onClose, onCreate }: SkillDialogProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
    }
  }, [open]);

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={saving ? undefined : onClose}>
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="h5">Add skill</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.75 }}>
          Add a reusable skill for candidate profiles.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2 }}>
        <TextField
          autoFocus
          fullWidth
          required
          label="Skill name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3, pt: 2 }}>
        <Button color="inherit" disabled={saving} onClick={onClose} sx={{ minHeight: 42, minWidth: 96 }}>
          Cancel
        </Button>
        <Button
          disabled={saving || !name.trim()}
          variant="contained"
          onClick={() => onCreate({ name })}
          sx={{ minHeight: 42, minWidth: 132 }}
        >
          Create skill
        </Button>
      </DialogActions>
    </Dialog>
  );
}
