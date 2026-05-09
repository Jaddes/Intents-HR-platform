import { useCallback, useEffect, useMemo, useState } from 'react';
import { Backdrop, CircularProgress, Snackbar, Alert } from '@mui/material';
import { AppLayout, type PageKey } from './components/AppLayout';
import { AssignSkillDialog } from './components/AssignSkillDialog';
import { CandidateDialog } from './components/CandidateDialog';
import { ErrorAlert } from './components/ErrorAlert';
import { SkillDialog } from './components/SkillDialog';
import { DashboardPage } from './pages/DashboardPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { SkillsPage } from './pages/SkillsPage';
import { candidatesApi, getErrorMessage, skillsApi } from './api/client';
import type {
  Candidate,
  CandidateCreateRequest,
  CandidateUpdateRequest,
  Skill,
  SkillCreateRequest,
} from './types';

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [candidateDialogOpen, setCandidateDialogOpen] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchName, setSearchName] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [candidateData, skillData] = await Promise.all([
        candidatesApi.getAll(),
        skillsApi.getAll(),
      ]);
      setCandidates(candidateData);
      setSkills(skillData);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const runAction = async (action: () => Promise<void>, message: string) => {
    setSaving(true);
    setError(null);
    try {
      await action();
      setSuccess(message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const skillIds = selectedSkillId ? [Number(selectedSkillId)] : [];
      const result = await candidatesApi.search(searchName, skillIds, []);
      setCandidates(result);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchName('');
    setSelectedSkillId('');
    await loadData();
  };

  const handleCreateCandidate = async (payload: CandidateCreateRequest) => {
    await runAction(async () => {
      await candidatesApi.create(payload);
      setCandidateDialogOpen(false);
      await loadData();
    }, 'Candidate created.');
  };

  const handleUpdateCandidate = async (candidateId: number, payload: CandidateUpdateRequest) => {
    await runAction(async () => {
      await candidatesApi.update(candidateId, payload);
      setCandidateDialogOpen(false);
      setSelectedCandidate(null);
      await loadData();
    }, 'Candidate updated.');
  };

  const handleDeleteCandidate = async (candidateId: number) => {
    await runAction(async () => {
      await candidatesApi.remove(candidateId);
      await loadData();
    }, 'Candidate deleted.');
  };

  const handleAssignSkill = async (candidateId: number, skillId: number) => {
    await runAction(async () => {
      await candidatesApi.addSkill(candidateId, skillId);
      setAssignDialogOpen(false);
      setSelectedCandidate(null);
      await loadData();
    }, 'Skill assigned.');
  };

  const handleRemoveSkill = async (candidateId: number, skillId: number) => {
    await runAction(async () => {
      await candidatesApi.removeSkill(candidateId, skillId);
      await loadData();
    }, 'Skill removed.');
  };

  const handleCreateSkill = async (payload: SkillCreateRequest) => {
    await runAction(async () => {
      await skillsApi.create(payload);
      setSkillDialogOpen(false);
      await loadData();
    }, 'Skill created.');
  };

  const currentPage = useMemo(() => {
    if (activePage === 'dashboard') {
      return <DashboardPage candidates={candidates} skills={skills} />;
    }

    if (activePage === 'skills') {
      return (
        <SkillsPage
          loading={loading}
          skills={skills}
          onCreateClick={() => setSkillDialogOpen(true)}
        />
      );
    }

    return (
      <CandidatesPage
        candidates={candidates}
        loading={loading}
        searchName={searchName}
        selectedSkillId={selectedSkillId}
        skills={skills}
        onAssignSkillClick={(candidate) => {
          setSelectedCandidate(candidate);
          setAssignDialogOpen(true);
        }}
        onClearSearch={handleClearSearch}
        onCreateClick={() => {
          setSelectedCandidate(null);
          setCandidateDialogOpen(true);
        }}
        onDeleteClick={handleDeleteCandidate}
        onEditClick={(candidate) => {
          setSelectedCandidate(candidate);
          setCandidateDialogOpen(true);
        }}
        onRemoveSkill={handleRemoveSkill}
        onSearch={handleSearch}
        onSearchNameChange={setSearchName}
        onSelectedSkillChange={setSelectedSkillId}
      />
    );
  }, [activePage, candidates, loading, searchName, selectedSkillId, skills]);

  return (
    <AppLayout activePage={activePage} onPageChange={setActivePage}>
      <ErrorAlert message={error} />
      {currentPage}

      <CandidateDialog
        candidate={selectedCandidate}
        open={candidateDialogOpen}
        saving={saving}
        skills={skills}
        onClose={() => {
          setCandidateDialogOpen(false);
          setSelectedCandidate(null);
        }}
        onCreate={handleCreateCandidate}
        onUpdate={handleUpdateCandidate}
      />

      <AssignSkillDialog
        candidate={selectedCandidate}
        open={assignDialogOpen}
        saving={saving}
        skills={skills}
        onAssign={handleAssignSkill}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedCandidate(null);
        }}
      />

      <SkillDialog
        open={skillDialogOpen}
        saving={saving}
        onClose={() => setSkillDialogOpen(false)}
        onCreate={handleCreateSkill}
      />

      <Backdrop open={loading || saving} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        autoHideDuration={3000}
        open={Boolean(success)}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" variant="filled" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}

export default App;
