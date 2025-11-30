import { ContentValidation, ContentUtils } from '@/lib/parenting/content-utils';
import { HABITS_CATEGORIES } from '@/types/parenting';

describe('ContentValidation', () => {
  describe('validateCreateContent', () => {
    it('should validate valid content creation data', () => {
      const validData = {
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content body',
        contentType: 'article',
        category: 'H',
        ageGroupMin: 0,
        ageGroupMax: 12,
        expertLevel: 'beginner',
        tags: ['nutrition', 'health'],
        authorId: 'user123',
      };

      const result = ContentValidation.validateCreateContent(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject content with missing required fields', () => {
      const invalidData = {
        title: '',
        description: '',
        content: '',
        authorId: '',
      };

      const result = ContentValidation.validateCreateContent(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid content type', () => {
      const invalidData = {
        title: 'Test',
        description: 'Test',
        content: 'Test',
        contentType: 'invalid-type',
        category: 'H',
        ageGroupMin: 0,
        ageGroupMax: 12,
        authorId: 'user123',
      };

      const result = ContentValidation.validateCreateContent(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Content type'))).toBe(true);
    });

    it('should reject invalid H.A.B.I.T.S. category', () => {
      const invalidData = {
        title: 'Test',
        description: 'Test',
        content: 'Test',
        contentType: 'article',
        category: 'X',
        ageGroupMin: 0,
        ageGroupMax: 12,
        authorId: 'user123',
      };

      const result = ContentValidation.validateCreateContent(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Category'))).toBe(true);
    });

    it('should reject invalid age group ranges', () => {
      const invalidData = {
        title: 'Test',
        description: 'Test',
        content: 'Test',
        contentType: 'article',
        category: 'H',
        ageGroupMin: 12,
        ageGroupMax: 6, // Min greater than max
        authorId: 'user123',
      };

      const result = ContentValidation.validateCreateContent(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('minimum must be less than maximum'))).toBe(true);
    });
  });

  describe('validateUpdateContent', () => {
    it('should validate partial update data', () => {
      const updateData = {
        title: 'Updated Title',
        status: 'published',
      };

      const result = ContentValidation.validateUpdateContent(updateData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid status', () => {
      const updateData = {
        status: 'invalid-status',
      };

      const result = ContentValidation.validateUpdateContent(updateData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Status'))).toBe(true);
    });
  });

  describe('validateSearchQuery', () => {
    it('should validate valid search query', () => {
      const query = {
        ageGroupMin: 0,
        ageGroupMax: 24,
        limit: 20,
        offset: 0,
      };

      const result = ContentValidation.validateSearchQuery(query);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid limit values', () => {
      const query = {
        limit: 150, // Too high
      };

      const result = ContentValidation.validateSearchQuery(query);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Limit'))).toBe(true);
    });
  });
});

describe('ContentUtils', () => {
  describe('getCategoryDisplayName', () => {
    it('should return correct display names for H.A.B.I.T.S. categories', () => {
      expect(ContentUtils.getCategoryDisplayName('H')).toBe('Healthy Eating');
      expect(ContentUtils.getCategoryDisplayName('A')).toBe('Active Movement');
      expect(ContentUtils.getCategoryDisplayName('B')).toBe('Balanced Stress');
      expect(ContentUtils.getCategoryDisplayName('I')).toBe('Inner Coaching');
      expect(ContentUtils.getCategoryDisplayName('T')).toBe('Timekeepers');
      expect(ContentUtils.getCategoryDisplayName('S')).toBe('Sufficient Sleep');
      expect(ContentUtils.getCategoryDisplayName('general')).toBe('General');
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const content = 'This is a test content with exactly ten words in it.';
      const readingTime = ContentUtils.calculateReadingTime(content, 200);
      expect(readingTime).toBe(1); // 10 words / 200 wpm = 0.05 minutes, rounded up to 1
    });

    it('should handle longer content', () => {
      const content = 'word '.repeat(400); // 400 words
      const readingTime = ContentUtils.calculateReadingTime(content, 200);
      expect(readingTime).toBe(2); // 400 words / 200 wpm = 2 minutes
    });
  });

  describe('extractSummary', () => {
    it('should extract summary with word limit', () => {
      const content = 'This is a long content that should be truncated after a certain number of words to create a summary.';
      const summary = ContentUtils.extractSummary(content, 5);
      expect(summary).toBe('This is a long content...');
    });

    it('should return full content if under word limit', () => {
      const content = 'Short content.';
      const summary = ContentUtils.extractSummary(content, 10);
      expect(summary).toBe('Short content.');
    });
  });

  describe('isAgeAppropriate', () => {
    it('should return true for age within range', () => {
      const result = ContentUtils.isAgeAppropriate(0, 24, 12);
      expect(result).toBe(true);
    });

    it('should return false for age outside range', () => {
      const result = ContentUtils.isAgeAppropriate(0, 12, 24);
      expect(result).toBe(false);
    });

    it('should return true for age at boundaries', () => {
      expect(ContentUtils.isAgeAppropriate(0, 12, 0)).toBe(true);
      expect(ContentUtils.isAgeAppropriate(0, 12, 12)).toBe(true);
    });
  });

  describe('generateTags', () => {
    it('should generate relevant tags from title and description', () => {
      const title = 'Healthy Eating for Toddlers';
      const description = 'Learn about nutrition and meal planning for young children';
      const tags = ContentUtils.generateTags(title, description);
      
      expect(tags).toContain('healthy');
      expect(tags).toContain('eating');
      expect(tags).toContain('toddlers');
      expect(tags).toContain('nutrition');
      expect(tags).toContain('meal');
      expect(tags).toContain('planning');
      expect(tags).toContain('young');
      expect(tags).toContain('children');
    });

    it('should filter out common words', () => {
      const title = 'The Best Way to Handle Tantrums';
      const description = 'This is a guide about managing difficult behavior';
      const tags = ContentUtils.generateTags(title, description);
      
      expect(tags).not.toContain('the');
      expect(tags).not.toContain('is');
      expect(tags).not.toContain('a');
      expect(tags).not.toContain('to');
    });

    it('should limit tags to 10 items', () => {
      const longText = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12';
      const tags = ContentUtils.generateTags(longText, '');
      expect(tags.length).toBeLessThanOrEqual(10);
    });
  });

  describe('calculateEngagementScore', () => {
    it('should calculate engagement score with proper weights', () => {
      const score = ContentUtils.calculateEngagementScore(100, 10, 5, 2, 4.5);
      // (100*1) + (10*5) + (5*3) + (2*10) + (4.5*2) = 100 + 50 + 15 + 20 + 9 = 194
      expect(score).toBe(194);
    });

    it('should handle zero values', () => {
      const score = ContentUtils.calculateEngagementScore(0, 0, 0, 0, 0);
      expect(score).toBe(0);
    });
  });

  describe('getContentDifficulty', () => {
    it('should return easy for beginner content with short reading time', () => {
      const difficulty = ContentUtils.getContentDifficulty('beginner', 2, 1);
      expect(difficulty).toBe('easy');
    });

    it('should return challenging for advanced content with long reading time', () => {
      const difficulty = ContentUtils.getContentDifficulty('advanced', 10, 3);
      expect(difficulty).toBe('challenging');
    });

    it('should return moderate for intermediate content', () => {
      const difficulty = ContentUtils.getContentDifficulty('intermediate', 5, 2);
      expect(difficulty).toBe('moderate');
    });
  });

  describe('generateContentMetadata', () => {
    it('should generate complete metadata', () => {
      const content = {
        title: 'Test Article',
        description: 'This is a test article about parenting',
        category: 'H',
        ageGroupMin: 0,
        ageGroupMax: 12,
        tags: ['nutrition', 'health', 'babies'],
      };

      const metadata = ContentUtils.generateContentMetadata(content);
      
      expect(metadata.title).toBe('Test Article');
      expect(metadata.description).toBe('This is a test article about parenting');
      expect(metadata.keywords).toBe('nutrition, health, babies');
      expect(metadata.category).toBe('Healthy Eating');
      expect(metadata.ageRange).toBe('0-12 months');
      expect(typeof metadata.readingTime).toBe('number');
    });

    it('should handle single age group', () => {
      const content = {
        title: 'Test',
        description: 'Test',
        category: 'A',
        ageGroupMin: 6,
        ageGroupMax: 6,
        tags: [],
      };

      const metadata = ContentUtils.generateContentMetadata(content);
      expect(metadata.ageRange).toBe('6 months');
    });
  });
});