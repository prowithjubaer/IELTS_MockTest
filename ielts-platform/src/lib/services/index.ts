/**
 * Service Layer - Central exports
 * 
 * All services use the adapter pattern:
 * - If Supabase is configured → use real database
 * - If not configured → use demo/mock data fallback
 */

export { authService, type AuthUser } from './auth.service';
export { testsService } from './tests.service';
export { attemptsService } from './attempts.service';
export { storageService, type UploadResult, type UploadProgress } from './storage.service';
export { dashboardService } from './dashboard.service';
export { scoringService } from './scoring.service';
export { examService, type ExamTestData, type ExamPart, type ExamQuestionGroup, type ExamQuestion, type ExamResult } from './exam.service';
export { BaseService, type ServiceResult, success, failure } from './base.service';
