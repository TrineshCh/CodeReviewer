import { analyses, reviews } from '../mock/reviews';
import { simulateDelay } from '../mock/delay';
import { Analysis, Review } from '../types';

export const reviewService = {
  async getAnalysis(taskId: string): Promise<Analysis | null> {
    await simulateDelay(200);
    return analyses.find((a) => a.taskId === taskId) || null;
  },

  async getReview(taskId: string): Promise<Review | null> {
    await simulateDelay(200);
    return reviews.find((r) => r.taskId === taskId) || null;
  },

  async getReviewsByAdmin(adminId: string): Promise<Review[]> {
    await simulateDelay(200);
    return reviews.filter((r) => r.adminId === adminId);
  },

  async getReviewsByEmployee(_employeeId: string, taskIds: string[]): Promise<Review[]> {
    await simulateDelay(200);
    return reviews.filter((r) => taskIds.includes(r.taskId));
  },

  async submitReview(reviewData: Omit<Review, 'id' | 'reviewedAt'>): Promise<Review> {
    await simulateDelay(500);
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      reviewedAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    return newReview;
  },
};
