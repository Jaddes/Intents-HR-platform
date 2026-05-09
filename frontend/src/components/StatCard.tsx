import type { ReactNode } from 'react';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';

type StatCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: ReactNode;
  color: string;
};

export function StatCard({ title, value, helper, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {value}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
              {helper}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, height: 52, width: 52 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
