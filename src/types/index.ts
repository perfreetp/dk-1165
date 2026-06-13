export interface Brand {
  name: string;
  slogan: string;
  tone: string;
}

export interface Audience {
  ageRange: string;
  gender: string;
  interests: string[];
}

export interface Constraints {
  budget: string;
  deadline: string;
  requirements: string;
}

export interface Brief {
  id: string;
  brand: Brand;
  audience: Audience;
  channels: string[];
  constraints: Constraints;
  createdAt: number;
}

export type IdeaType = 'title' | 'script' | 'poster' | 'activity';
export type CostLevel = 'high' | 'medium' | 'low';

export interface Idea {
  id: string;
  briefId: string;
  type: IdeaType;
  title: string;
  content: string;
  style: string[];
  cost: CostLevel;
  tags: string[];
  liked: boolean;
  createdAt: number;
}

export interface Material {
  id: string;
  url: string;
  name: string;
  folderId: string;
  relatedIdeas: string[];
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: number;
}

export interface ReviewScores {
  creativity: number;
  feasibility: number;
  alignment: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'revision';

export interface Review {
  id: string;
  ideaId: string;
  reviewer: string;
  scores: ReviewScores;
  comments: Comment[];
  status: ReviewStatus;
  createdAt: number;
}

export interface Proposal {
  id: string;
  name: string;
  ideaIds: string[];
  outline: string;
  status: 'draft' | 'final';
  createdAt: number;
}

export interface AppState {
  briefs: Brief[];
  ideas: Idea[];
  materials: Material[];
  folders: Folder[];
  reviews: Review[];
  proposals: Proposal[];
  currentBrief: Brief | null;
  selectedIdeas: string[];
}
