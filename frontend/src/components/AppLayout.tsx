import type { ReactNode } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

export type PageKey = 'dashboard' | 'candidates' | 'skills';

type AppLayoutProps = {
  activePage: PageKey;
  onPageChange: (page: PageKey) => void;
  children: ReactNode;
};

const drawerWidth = 264;

const navItems: Array<{ key: PageKey; label: string; icon: ReactNode }> = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'candidates', label: 'Candidates', icon: <GroupsIcon /> },
  { key: 'skills', label: 'Skills', icon: <PsychologyIcon /> },
];

export function AppLayout({ activePage, onPageChange, children }: AppLayoutProps) {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#111827',
            color: '#e5e7eb',
            borderRight: 0,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', borderRadius: 1.5 }}>
              <BusinessCenterIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Intents HR</Typography>
              <Typography color="#9ca3af" variant="caption">
                Candidate platform
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <List sx={{ px: 2, py: 2 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.key}
              selected={activePage === item.key}
              onClick={() => onPageChange(item.key)}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                color: activePage === item.key ? '#ffffff' : '#cbd5e1',
                '&.Mui-selected': {
                  bgcolor: 'rgba(99, 91, 255, 0.22)',
                },
                '&.Mui-selected:hover, &:hover': {
                  bgcolor: 'rgba(99, 91, 255, 0.18)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          left: `${drawerWidth}px`,
          right: 0,
          width: 'auto',
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6">HR Candidate Management</Typography>
            <Typography color="text.secondary" variant="body2">
              Manage candidates, skills, and hiring profiles
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'secondary.main', flex: '0 0 auto' }}>HR</Avatar>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          boxSizing: 'border-box',
          ml: `${drawerWidth}px`,
          overflowX: 'hidden',
          pb: 5,
          pt: 12,
          px: 3,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
