import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
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
      <DialogTitle>Add skill</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          autoFocus
          fullWidth
          required
          label="Skill name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button color="inherit" disabled={saving} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={saving} variant="contained" onClick={() => onCreate({ name })}>
          Create skill
        </Button>
      </DialogActions>
    </Dialog>
  );
}
