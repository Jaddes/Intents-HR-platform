import { Alert, Collapse } from '@mui/material';

type ErrorAlertProps = {
  message: string | null;
};

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Collapse in={Boolean(message)}>
      {message ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      ) : null}
    </Collapse>
  );
}
