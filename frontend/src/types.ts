export type Skill = {
  id: number;
  name: string;
};

export type Candidate = {
  id: number;
  fullName: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  skills: Skill[];
};

export type CandidateCreateRequest = {
  fullName: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  skillIds: number[];
};

export type CandidateUpdateRequest = {
  fullName: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
};

export type SkillCreateRequest = {
  name: string;
};

export type ApiError = {
  code?: string;
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};
