import { create } from 'zustand';
import { Analysis, Review } from '../types';
import { reviewService } from '../api/reviewService';
import { analysisService } from '../api/analysisService';

interface ReviewState {
  analyses: Record<string, Analysis>;
  reviews: Record<string, Review>;
  isLoading: boolean;
  fetchAnalysis: (taskId: string) => Promise<void>;
  fetchReview: (taskId: string) => Promise<void>;
  submitReview: (reviewData: Omit<Review, 'id' | 'reviewedAt'>) => Promise<Review>;
  analyzeRepo: (taskId: string) => Promise<Analysis>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  analyses: {},
  reviews: {},
  isLoading: false,
  fetchAnalysis: async (taskId) => {
    const analysis = await reviewService.getAnalysis(taskId);
    if (analysis) {
      set((state) => ({ analyses: { ...state.analyses, [taskId]: analysis } }));
    }
  },
  fetchReview: async (taskId) => {
    const review = await reviewService.getReview(taskId);
    if (review) {
      set((state) => ({ reviews: { ...state.reviews, [taskId]: review } }));
    }
  },
  submitReview: async (reviewData) => {
    set({ isLoading: true });
    const review = await reviewService.submitReview(reviewData);
    set((state) => ({
      reviews: { ...state.reviews, [review.taskId]: review },
      isLoading: false,
    }));
    return review;
  },
  analyzeRepo: async (taskId) => {
    set({ isLoading: true });
    const analysis = await analysisService.analyzeRepo(taskId);
    set((state) => ({
      analyses: { ...state.analyses, [taskId]: analysis },
      isLoading: false,
    }));
    return analysis;
  },
}));
