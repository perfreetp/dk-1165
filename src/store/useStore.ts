import { create } from 'zustand';
import type { Brief, Idea, Material, Folder, Review, Proposal, IdeaType, CostLevel } from '../types';

interface AppStore {
  briefs: Brief[];
  ideas: Idea[];
  materials: Material[];
  folders: Folder[];
  reviews: Review[];
  proposals: Proposal[];
  currentBrief: Brief | null;
  selectedIdeas: string[];

  addBrief: (brief: Brief) => void;
  setCurrentBrief: (brief: Brief | null) => void;
  addIdea: (idea: Idea) => void;
  toggleLike: (ideaId: string) => void;
  updateIdeaCost: (ideaId: string, cost: CostLevel) => void;
  updateIdeaTags: (ideaId: string, tags: string[]) => void;
  mergeIdeas: (ideaIds: string[], title: string, content: string) => void;
  deleteIdea: (ideaId: string) => void;
  addMaterial: (material: Material) => void;
  deleteMaterial: (materialId: string) => void;
  addFolder: (folder: Folder) => void;
  deleteFolder: (folderId: string) => void;
  addReview: (review: Review) => void;
  updateReviewStatus: (reviewId: string, status: Review['status']) => void;
  addProposal: (proposal: Proposal) => void;
  setSelectedIdeas: (ideaIds: string[]) => void;
  toggleIdeaSelection: (ideaId: string) => void;
  clearSelection: () => void;
}

export const useStore = create<AppStore>((set) => ({
  briefs: [],
  ideas: [],
  materials: [],
  folders: [{ id: 'default', name: '默认文件夹', parentId: null }],
  reviews: [],
  proposals: [],
  currentBrief: null,
  selectedIdeas: [],

  addBrief: (brief) =>
    set((state) => ({
      briefs: [brief, ...state.briefs],
      currentBrief: brief,
    })),

  setCurrentBrief: (brief) =>
    set({ currentBrief: brief }),

  addIdea: (idea) =>
    set((state) => ({
      ideas: [idea, ...state.ideas],
    })),

  toggleLike: (ideaId) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, liked: !idea.liked } : idea
      ),
    })),

  updateIdeaCost: (ideaId, cost) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, cost } : idea
      ),
    })),

  updateIdeaTags: (ideaId, tags) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, tags } : idea
      ),
    })),

  mergeIdeas: (ideaIds, title, content) =>
    set((state) => {
      const mergedIdea: Idea = {
        id: `merged-${Date.now()}`,
        briefId: state.currentBrief?.id || '',
        type: 'title' as IdeaType,
        title,
        content,
        style: [],
        cost: 'medium',
        tags: ['merged'],
        liked: false,
        createdAt: Date.now(),
      };
      return {
        ideas: [...state.ideas.filter(i => !ideaIds.includes(i.id)), mergedIdea],
        selectedIdeas: [],
      };
    }),

  deleteIdea: (ideaId) =>
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== ideaId),
    })),

  addMaterial: (material) =>
    set((state) => ({
      materials: [material, ...state.materials],
    })),

  deleteMaterial: (materialId) =>
    set((state) => ({
      materials: state.materials.filter((material) => material.id !== materialId),
    })),

  addFolder: (folder) =>
    set((state) => ({
      folders: [...state.folders, folder],
    })),

  deleteFolder: (folderId) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== folderId),
      materials: state.materials.map((material) =>
        material.folderId === folderId ? { ...material, folderId: 'default' } : material
      ),
    })),

  addReview: (review) =>
    set((state) => ({
      reviews: [...state.reviews, review],
    })),

  updateReviewStatus: (reviewId, status) =>
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === reviewId ? { ...review, status } : review
      ),
    })),

  addProposal: (proposal) =>
    set((state) => ({
      proposals: [proposal, ...state.proposals],
    })),

  setSelectedIdeas: (ideaIds) =>
    set({ selectedIdeas: ideaIds }),

  toggleIdeaSelection: (ideaId) =>
    set((state) => ({
      selectedIdeas: state.selectedIdeas.includes(ideaId)
        ? state.selectedIdeas.filter((id) => id !== ideaId)
        : [...state.selectedIdeas, ideaId],
    })),

  clearSelection: () =>
    set({ selectedIdeas: [] }),
}));
