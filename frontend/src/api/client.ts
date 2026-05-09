import axios, { AxiosError } from 'axios';
import type {
  ApiError,
  Candidate,
  CandidateCreateRequest,
  CandidateUpdateRequest,
  Skill,
  SkillCreateRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5121';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<ApiError>(error)) {
    return 'Something went wrong. Please try again.';
  }

  const axiosError = error as AxiosError<ApiError>;
  const payload = axiosError.response?.data;

  if (payload?.message) {
    return payload.message;
  }

  if (payload?.errors) {
    return Object.values(payload.errors).flat().join(' ');
  }

  if (payload?.title) {
    return payload.title;
  }

  return axiosError.message || 'The API request failed.';
};

export const candidatesApi = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>('/api/candidates');
    return response.data;
  },

  search: async (name: string, skillIds: number[], skillNames: string[]): Promise<Candidate[]> => {
    const params = new URLSearchParams();

    if (name.trim()) {
      params.append('name', name.trim());
    }

    skillIds.forEach((skillId) => params.append('skillIds', skillId.toString()));
    skillNames.forEach((skillName) => params.append('skillNames', skillName));

    const query = params.toString();
    const response = await apiClient.get<Candidate[]>(
      `/api/candidates/search${query ? `?${query}` : ''}`,
    );

    return response.data;
  },

  create: async (payload: CandidateCreateRequest): Promise<Candidate> => {
    const response = await apiClient.post<Candidate>('/api/candidates', payload);
    return response.data;
  },

  update: async (candidateId: number, payload: CandidateUpdateRequest): Promise<Candidate> => {
    const response = await apiClient.put<Candidate>(`/api/candidates/${candidateId}`, payload);
    return response.data;
  },

  remove: async (candidateId: number): Promise<void> => {
    await apiClient.delete(`/api/candidates/${candidateId}`);
  },

  addSkill: async (candidateId: number, skillId: number): Promise<Candidate> => {
    const response = await apiClient.post<Candidate>(
      `/api/candidates/${candidateId}/skills/${skillId}`,
    );
    return response.data;
  },

  removeSkill: async (candidateId: number, skillId: number): Promise<Candidate> => {
    const response = await apiClient.delete<Candidate>(
      `/api/candidates/${candidateId}/skills/${skillId}`,
    );
    return response.data;
  },
};

export const skillsApi = {
  getAll: async (): Promise<Skill[]> => {
    const response = await apiClient.get<Skill[]>('/api/skills');
    return response.data;
  },

  create: async (payload: SkillCreateRequest): Promise<Skill> => {
    const response = await apiClient.post<Skill>('/api/skills', payload);
    return response.data;
  },
};
