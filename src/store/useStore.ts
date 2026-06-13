import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Brief, Idea, Material, Folder, Review, Proposal, IdeaType, CostLevel } from '../types';

interface AppStore {
  briefs: Brief[];
  ideas: Idea[];
  materials: Material[];
  folders: Folder[];
  reviews: Review[];
  proposals: Proposal[];
  colleagues: string[];
  currentBrief: Brief | null;
  selectedIdeas: string[];
  selectedForProposal: string[];

  addBrief: (brief: Brief) => void;
  setCurrentBrief: (brief: Brief | null) => void;
  addIdea: (idea: Idea) => void;
  isIdeaLiked: (ideaId: string) => boolean;
  isIdeaInPool: (idea: Idea) => boolean;
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
  addColleague: (name: string) => void;
  removeColleague: (name: string) => void;
  toggleIdeaForProposal: (ideaId: string) => void;
  setSelectedForProposal: (ideaIds: string[]) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      briefs: [],
      ideas: [],
      materials: [],
      folders: [{ id: 'default', name: '默认文件夹', parentId: null }],
      reviews: [],
      proposals: [],
      colleagues: [],
      currentBrief: null,
      selectedIdeas: [],
      selectedForProposal: [],

      addBrief: (brief) =>
        set((state) => ({
          briefs: [brief, ...state.briefs],
          currentBrief: brief,
        })),

      setCurrentBrief: (brief) =>
        set({ currentBrief: brief }),

      addIdea: (idea) =>
        set((state) => {
          const exists = state.ideas.some(
            i => i.title === idea.title && i.content === idea.content && i.type === idea.type
          );
          if (exists) return state;
          return { ideas: [idea, ...state.ideas] };
        }),

      isIdeaLiked: (ideaId) => {
        const state = get();
        return state.ideas.some(i => i.id === ideaId && i.liked);
      },

      isIdeaInPool: (idea) => {
        const state = get();
        return state.ideas.some(
          i => i.title === idea.title && i.content === idea.content && i.type === idea.type
        );
      },

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
            liked: true,
            createdAt: Date.now(),
          };
          return {
            ideas: [mergedIdea, ...state.ideas],
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
          selectedForProposal: [],
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

      addColleague: (name) =>
        set((state) => ({
          colleagues: state.colleagues.includes(name)
            ? state.colleagues
            : [...state.colleagues, name],
        })),

      removeColleague: (name) =>
        set((state) => ({
          colleagues: state.colleagues.filter((c) => c !== name),
        })),

      toggleIdeaForProposal: (ideaId) =>
        set((state) => ({
          selectedForProposal: state.selectedForProposal.includes(ideaId)
            ? state.selectedForProposal.filter((id) => id !== ideaId)
            : [...state.selectedForProposal, ideaId],
        })),

      setSelectedForProposal: (ideaIds) =>
        set({ selectedForProposal: ideaIds }),
    }),
    {
      name: 'ai-creative-factory-storage',
      partialize: (state) => ({
        briefs: state.briefs,
        ideas: state.ideas,
        materials: state.materials,
        folders: state.folders,
        reviews: state.reviews,
        proposals: state.proposals,
        colleagues: state.colleagues,
      }),
    }
  )
);
