export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified?: Date;
  savedDPEs: DPE[];
  savedDPEIds: string[];
  reviews: Review[];
}

export interface DPE {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  checkrideTypes: string[];
  tags: string[];
  region: string;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
  savedByUsers: User[];
  savedByUserIds: string[];
}

export interface Review {
  id: string;
  content: string;
  overallRating?: number;
  difficultyRating?: number;
  wouldRecommend?: boolean;
  checkridePassed?: boolean;
  groundFirst?: boolean;
  checkrideType: string;
  tags: string[];
  userName: string;
  user?: User;
  userId?: string;
  dpe: DPE;
  dpeId: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface CreateDPERequest {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  region: string;
  checkrideTypes: string[];
  tags: string[];
}

export interface SaveDPERequest {
  dpeId: string;
}

export interface CreateReviewRequest {
  dpeId: string;
  content: string;
  overallRating?: number;
  difficultyRating?: number;
  wouldRecommend?: boolean;
  checkridePassed?: boolean;
  groundFirst?: boolean;
  checkrideType: string;
  tags: string[];
}

export interface APIErrorResponse {
  error: {
    message: string;
    type: string;
    details?: unknown;
  };
}

export interface SaveDPEResponse {
  saved: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  certificate: string;
  homeAirport: string;
} 