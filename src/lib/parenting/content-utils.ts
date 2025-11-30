import { HABITSCategory, HABITS_CATEGORIES } from '@/types/parenting';

/**
 * Content validation utilities for Digital Parenting Platform
 */

export class ContentValidation {
  /**
   * Validate content creation input
   */
  static validateCreateContent(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string');
    }

    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      errors.push('Description is required and must be a non-empty string');
    }

    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      errors.push('Content is required and must be a non-empty string');
    }

    if (!data.authorId || typeof data.authorId !== 'string') {
      errors.push('Author ID is required');
    }

    // Content type validation
    const validContentTypes = ['article', 'video', 'infographic', 'checklist', 'guide'];
    if (!data.contentType || !validContentTypes.includes(data.contentType)) {
      errors.push(`Content type must be one of: ${validContentTypes.join(', ')}`);
    }

    // Category validation (H.A.B.I.T.S. framework)
    const validCategories = ['H', 'A', 'B', 'I', 'T', 'S', 'general'];
    if (!data.category || !validCategories.includes(data.category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }

    // Age group validation
    if (typeof data.ageGroupMin !== 'number' || data.ageGroupMin < 0) {
      errors.push('Age group minimum must be a non-negative number');
    }

    if (typeof data.ageGroupMax !== 'number' || data.ageGroupMax < 0) {
      errors.push('Age group maximum must be a non-negative number');
    }

    if (data.ageGroupMin >= data.ageGroupMax) {
      errors.push('Age group minimum must be less than maximum');
    }

    // Expert level validation
    if (data.expertLevel) {
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validLevels.includes(data.expertLevel)) {
        errors.push(`Expert level must be one of: ${validLevels.join(', ')}`);
      }
    }

    // Tags validation
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate content update input
   */
  static validateUpdateContent(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Optional field validations (only validate if provided)
    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push('Title must be a non-empty string');
      }
    }

    if (data.description !== undefined) {
      if (typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push('Description must be a non-empty string');
      }
    }

    if (data.content !== undefined) {
      if (typeof data.content !== 'string' || data.content.trim().length === 0) {
        errors.push('Content must be a non-empty string');
      }
    }

    if (data.contentType !== undefined) {
      const validContentTypes = ['article', 'video', 'infographic', 'checklist', 'guide'];
      if (!validContentTypes.includes(data.contentType)) {
        errors.push(`Content type must be one of: ${validContentTypes.join(', ')}`);
      }
    }

    if (data.category !== undefined) {
      const validCategories = ['H', 'A', 'B', 'I', 'T', 'S', 'general'];
      if (!validCategories.includes(data.category)) {
        errors.push(`Category must be one of: ${validCategories.join(', ')}`);
      }
    }

    if (data.ageGroupMin !== undefined) {
      if (typeof data.ageGroupMin !== 'number' || data.ageGroupMin < 0) {
        errors.push('Age group minimum must be a non-negative number');
      }
    }

    if (data.ageGroupMax !== undefined) {
      if (typeof data.ageGroupMax !== 'number' || data.ageGroupMax < 0) {
        errors.push('Age group maximum must be a non-negative number');
      }
    }

    if (data.ageGroupMin !== undefined && data.ageGroupMax !== undefined) {
      if (data.ageGroupMin >= data.ageGroupMax) {
        errors.push('Age group minimum must be less than maximum');
      }
    }

    if (data.expertLevel !== undefined) {
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validLevels.includes(data.expertLevel)) {
        errors.push(`Expert level must be one of: ${validLevels.join(', ')}`);
      }
    }

    if (data.status !== undefined) {
      const validStatuses = ['draft', 'review', 'published', 'archived'];
      if (!validStatuses.includes(data.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate search query parameters
   */
  static validateSearchQuery(query: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (query.ageGroupMin !== undefined) {
      if (typeof query.ageGroupMin !== 'number' || query.ageGroupMin < 0) {
        errors.push('Age group minimum must be a non-negative number');
      }
    }

    if (query.ageGroupMax !== undefined) {
      if (typeof query.ageGroupMax !== 'number' || query.ageGroupMax < 0) {
        errors.push('Age group maximum must be a non-negative number');
      }
    }

    if (query.limit !== undefined) {
      if (typeof query.limit !== 'number' || query.limit <= 0 || query.limit > 100) {
        errors.push('Limit must be a number between 1 and 100');
      }
    }

    if (query.offset !== undefined) {
      if (typeof query.offset !== 'number' || query.offset < 0) {
        errors.push('Offset must be a non-negative number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Content utility functions
 */
export class ContentUtils {
  /**
   * Get H.A.B.I.T.S. category display name
   */
  static getCategoryDisplayName(category: HABITSCategory | 'general'): string {
    if (category === 'general') return 'General';
    return HABITS_CATEGORIES[category];
  }

  /**
   * Calculate content reading time (words per minute)
   */
  static calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Extract content summary (first N words)
   */
  static extractSummary(content: string, wordLimit: number = 50): string {
    const words = content.trim().split(/\s+/);
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  /**
   * Check if content is age-appropriate for a child
   */
  static isAgeAppropriate(
    contentAgeMin: number,
    contentAgeMax: number,
    childAgeInMonths: number
  ): boolean {
    return childAgeInMonths >= contentAgeMin && childAgeInMonths <= contentAgeMax;
  }

  /**
   * Generate content tags from title and description
   */
  static generateTags(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    ]);

    const words = text
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 10); // Limit to 10 tags

    return words;
  }

  /**
   * Format content for display (sanitize HTML, format text)
   */
  static formatContentForDisplay(content: string): string {
    // Basic HTML sanitization (in production, use a proper library like DOMPurify)
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  /**
   * Calculate content engagement score
   */
  static calculateEngagementScore(
    views: number,
    shares: number,
    bookmarks: number,
    completions: number,
    rating: number
  ): number {
    // Weighted engagement score
    const viewWeight = 1;
    const shareWeight = 5;
    const bookmarkWeight = 3;
    const completionWeight = 10;
    const ratingWeight = 2;

    const score = 
      (views * viewWeight) +
      (shares * shareWeight) +
      (bookmarks * bookmarkWeight) +
      (completions * completionWeight) +
      (rating * ratingWeight);

    return Math.round(score);
  }

  /**
   * Get content difficulty level based on various factors
   */
  static getContentDifficulty(
    expertLevel: string,
    readingTime: number,
    conceptComplexity: number = 1
  ): 'easy' | 'moderate' | 'challenging' {
    let difficultyScore = 0;

    // Expert level contribution
    switch (expertLevel) {
      case 'beginner':
        difficultyScore += 1;
        break;
      case 'intermediate':
        difficultyScore += 2;
        break;
      case 'advanced':
        difficultyScore += 3;
        break;
    }

    // Reading time contribution
    if (readingTime <= 3) difficultyScore += 1;
    else if (readingTime <= 7) difficultyScore += 2;
    else difficultyScore += 3;

    // Concept complexity contribution
    difficultyScore += conceptComplexity;

    // Determine difficulty level
    if (difficultyScore <= 3) return 'easy';
    if (difficultyScore <= 6) return 'moderate';
    return 'challenging';
  }

  /**
   * Generate content metadata for SEO and discovery
   */
  static generateContentMetadata(content: {
    title: string;
    description: string;
    category: string;
    ageGroupMin: number;
    ageGroupMax: number;
    tags: string[];
  }) {
    const ageRange = content.ageGroupMin === content.ageGroupMax 
      ? `${content.ageGroupMin} months`
      : `${content.ageGroupMin}-${content.ageGroupMax} months`;

    return {
      title: content.title,
      description: content.description,
      keywords: content.tags.join(', '),
      category: ContentUtils.getCategoryDisplayName(content.category as any),
      ageRange,
      readingTime: ContentUtils.calculateReadingTime(content.description),
    };
  }
}