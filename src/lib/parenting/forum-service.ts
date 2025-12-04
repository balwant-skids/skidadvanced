import { prisma } from '@/lib/prisma';
import { ForumPost, ForumReply, Prisma } from '@prisma/client';
import { ForumPostWithDetails, ForumReplyWithDetails, CommunityGroup } from '@/types/parenting';

/**
 * Community Forum Service for Digital Parenting Platform
 * Handles forum posts, replies, voting, and moderation
 */

export interface CreatePostInput {
  authorId: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  childAgeGroup?: string;
  isAnonymous?: boolean;
}

export interface CreateReplyInput {
  postId: string;
  authorId: string;
  content: string;
  parentReplyId?: string;
}

export interface ForumFilters {
  category?: string;
  childAgeGroup?: string;
  tags?: string[];
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'recent' | 'popular' | 'replies';
}

export class ForumService {
  /**
   * Create a new forum post
   */
  static async createPost(data: CreatePostInput): Promise<ForumPost> {
    try {
      const post = await prisma.forumPost.create({
        data: {
          authorId: data.authorId,
          title: data.title,
          content: data.content,
          category: data.category,
          tags: JSON.stringify(data.tags || []),
          childAgeGroup: data.childAgeGroup,
          isAnonymous: data.isAnonymous || false,
          status: 'active',
          upvotes: 0,
          downvotes: 0,
          replyCount: 0,
          viewCount: 0,
        },
      });

      return post;
    } catch (error) {
      console.error('Error creating forum post:', error);
      throw new Error('Failed to create forum post');
    }
  }

  /**
   * Reply to a forum post
   */
  static async replyToPost(data: CreateReplyInput): Promise<ForumReply> {
    try {
      // Check if user is an expert
      const expert = await prisma.expert.findUnique({
        where: { userId: data.authorId },
      });

      const reply = await prisma.forumReply.create({
        data: {
          postId: data.postId,
          authorId: data.authorId,
          content: data.content,
          parentReplyId: data.parentReplyId,
          isExpertResponse: !!expert?.verified,
          status: 'active',
          upvotes: 0,
          downvotes: 0,
        },
      });

      // Update post reply count
      await prisma.forumPost.update({
        where: { id: data.postId },
        data: {
          replyCount: {
            increment: 1,
          },
        },
      });

      return reply;
    } catch (error) {
      console.error('Error creating forum reply:', error);
      throw new Error('Failed to create forum reply');
    }
  }

  /**
   * Get forum posts with filtering
   */
  static async getPosts(filters: ForumFilters): Promise<ForumPostWithDetails[]> {
    try {
      const where: Prisma.ForumPostWhereInput = {
        status: filters.status || 'active',
      };

      if (filters.category) {
        where.category = filters.category;
      }

      if (filters.childAgeGroup) {
        where.childAgeGroup = filters.childAgeGroup;
      }

      if (filters.tags && filters.tags.length > 0) {
        where.OR = filters.tags.map(tag => ({
          tags: { contains: tag },
        }));
      }

      let orderBy: Prisma.ForumPostOrderByWithRelationInput[];
      switch (filters.sortBy) {
        case 'popular':
          orderBy = [{ upvotes: 'desc' }, { viewCount: 'desc' }];
          break;
        case 'replies':
          orderBy = [{ replyCount: 'desc' }];
          break;
        case 'recent':
        default:
          orderBy = [{ isPinned: 'desc' }, { createdAt: 'desc' }];
          break;
      }

      const posts = await prisma.forumPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              votes: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
            take: 5, // Limit initial replies
          },
          votes: true,
        },
        orderBy,
        take: filters.limit || 20,
        skip: filters.offset || 0,
      });

      return posts;
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      throw new Error('Failed to fetch forum posts');
    }
  }

  /**
   * Get a specific post with all replies
   */
  static async getPost(id: string): Promise<ForumPostWithDetails | null> {
    try {
      // Increment view count
      await prisma.forumPost.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      const post = await prisma.forumPost.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              childReplies: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                  votes: true,
                },
              },
              votes: true,
            },
            where: {
              parentReplyId: null, // Only top-level replies
            },
            orderBy: {
              upvotes: 'desc',
            },
          },
          votes: true,
        },
      });

      return post;
    } catch (error) {
      console.error('Error fetching forum post:', error);
      throw new Error('Failed to fetch forum post');
    }
  }

  /**
   * Vote on a post
   */
  static async voteOnPost(
    postId: string,
    userId: string,
    vote: 'up' | 'down'
  ): Promise<void> {
    try {
      // Check if user already voted
      const existingVote = await prisma.postVote.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      if (existingVote) {
        if (existingVote.vote === vote) {
          // Remove vote if same vote
          await prisma.postVote.delete({
            where: {
              postId_userId: {
                postId,
                userId,
              },
            },
          });

          // Update post vote count
          await prisma.forumPost.update({
            where: { id: postId },
            data: {
              [vote === 'up' ? 'upvotes' : 'downvotes']: {
                decrement: 1,
              },
            },
          });
        } else {
          // Change vote
          await prisma.postVote.update({
            where: {
              postId_userId: {
                postId,
                userId,
              },
            },
            data: { vote },
          });

          // Update post vote counts
          await prisma.forumPost.update({
            where: { id: postId },
            data: {
              upvotes: {
                [vote === 'up' ? 'increment' : 'decrement']: 1,
              },
              downvotes: {
                [vote === 'down' ? 'increment' : 'decrement']: 1,
              },
            },
          });
        }
      } else {
        // Create new vote
        await prisma.postVote.create({
          data: {
            postId,
            userId,
            vote,
          },
        });

        // Update post vote count
        await prisma.forumPost.update({
          where: { id: postId },
          data: {
            [vote === 'up' ? 'upvotes' : 'downvotes']: {
              increment: 1,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error voting on post:', error);
      throw new Error('Failed to vote on post');
    }
  }

  /**
   * Vote on a reply
   */
  static async voteOnReply(
    replyId: string,
    userId: string,
    vote: 'up' | 'down'
  ): Promise<void> {
    try {
      // Check if user already voted
      const existingVote = await prisma.replyVote.findUnique({
        where: {
          replyId_userId: {
            replyId,
            userId,
          },
        },
      });

      if (existingVote) {
        if (existingVote.vote === vote) {
          // Remove vote if same vote
          await prisma.replyVote.delete({
            where: {
              replyId_userId: {
                replyId,
                userId,
              },
            },
          });

          // Update reply vote count
          await prisma.forumReply.update({
            where: { id: replyId },
            data: {
              [vote === 'up' ? 'upvotes' : 'downvotes']: {
                decrement: 1,
              },
            },
          });
        } else {
          // Change vote
          await prisma.replyVote.update({
            where: {
              replyId_userId: {
                replyId,
                userId,
              },
            },
            data: { vote },
          });

          // Update reply vote counts
          await prisma.forumReply.update({
            where: { id: replyId },
            data: {
              upvotes: {
                [vote === 'up' ? 'increment' : 'decrement']: 1,
              },
              downvotes: {
                [vote === 'down' ? 'increment' : 'decrement']: 1,
              },
            },
          });
        }
      } else {
        // Create new vote
        await prisma.replyVote.create({
          data: {
            replyId,
            userId,
            vote,
          },
        });

        // Update reply vote count
        await prisma.forumReply.update({
          where: { id: replyId },
          data: {
            [vote === 'up' ? 'upvotes' : 'downvotes']: {
              increment: 1,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error voting on reply:', error);
      throw new Error('Failed to vote on reply');
    }
  }

  /**
   * Flag content for moderation
   */
  static async flagContent(
    contentId: string,
    reason: string,
    contentType: 'post' | 'reply' = 'post'
  ): Promise<void> {
    try {
      if (contentType === 'post') {
        await prisma.forumPost.update({
          where: { id: contentId },
          data: { status: 'flagged' },
        });
      } else {
        await prisma.forumReply.update({
          where: { id: contentId },
          data: { status: 'flagged' },
        });
      }

      // TODO: Create moderation record with reason
      console.log(`Content ${contentId} flagged for: ${reason}`);
    } catch (error) {
      console.error('Error flagging content:', error);
      throw new Error('Failed to flag content');
    }
  }

  /**
   * Moderate content
   */
  static async moderateContent(
    contentId: string,
    action: 'approve' | 'remove',
    contentType: 'post' | 'reply' = 'post'
  ): Promise<void> {
    try {
      const status = action === 'approve' ? 'active' : 'removed';

      if (contentType === 'post') {
        await prisma.forumPost.update({
          where: { id: contentId },
          data: { status },
        });
      } else {
        await prisma.forumReply.update({
          where: { id: contentId },
          data: { status },
        });
      }
    } catch (error) {
      console.error('Error moderating content:', error);
      throw new Error('Failed to moderate content');
    }
  }

  /**
   * Get recommended community groups for a parent
   */
  static async getRecommendedGroups(parentId: string): Promise<CommunityGroup[]> {
    try {
      // Get parent's children ages
      const parent = await prisma.user.findUnique({
        where: { id: parentId },
        include: {
          parentProfile: {
            include: {
              children: true,
            },
          },
        },
      });

      if (!parent?.parentProfile?.children) {
        return [];
      }

      // Calculate age ranges for matching
      const childAges = parent.parentProfile.children.map(child => {
        const ageInMonths = Math.floor(
          (Date.now() - child.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
        );
        return ageInMonths;
      });

      // For now, return mock community groups
      // In a real implementation, this would query actual community groups
      const mockGroups: CommunityGroup[] = [
        {
          id: '1',
          name: 'New Parents Support',
          description: 'Support group for parents with newborns',
          ageGroupMin: 0,
          ageGroupMax: 6,
          memberCount: 245,
          category: 'support',
        },
        {
          id: '2',
          name: 'Toddler Adventures',
          description: 'Activities and tips for toddler parents',
          ageGroupMin: 12,
          ageGroupMax: 36,
          memberCount: 189,
          category: 'activities',
        },
        {
          id: '3',
          name: 'Preschool Prep',
          description: 'Preparing your child for preschool',
          ageGroupMin: 24,
          ageGroupMax: 60,
          memberCount: 156,
          category: 'education',
        },
        {
          id: '4',
          name: 'School Age Parents',
          description: 'Supporting parents of school-age children',
          ageGroupMin: 60,
          ageGroupMax: 144,
          memberCount: 203,
          category: 'education',
        },
        {
          id: '5',
          name: 'Teen Parent Network',
          description: 'Navigating the teenage years together',
          ageGroupMin: 144,
          ageGroupMax: 216,
          memberCount: 167,
          category: 'support',
        },
      ];

      // Filter groups based on child ages
      return mockGroups.filter(group => 
        childAges.some(age => 
          age >= group.ageGroupMin && age <= group.ageGroupMax
        )
      );
    } catch (error) {
      console.error('Error getting recommended groups:', error);
      throw new Error('Failed to get recommended groups');
    }
  }

  /**
   * Search forum posts
   */
  static async searchPosts(query: string, filters?: {
    category?: string;
    childAgeGroup?: string;
    limit?: number;
    offset?: number;
  }): Promise<ForumPostWithDetails[]> {
    try {
      const where: Prisma.ForumPostWhereInput = {
        status: 'active',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.childAgeGroup) {
        where.childAgeGroup = filters.childAgeGroup;
      }

      const posts = await prisma.forumPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              votes: true,
            },
            take: 3,
          },
          votes: true,
        },
        orderBy: [
          { upvotes: 'desc' },
          { createdAt: 'desc' },
        ],
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
      });

      return posts;
    } catch (error) {
      console.error('Error searching forum posts:', error);
      throw new Error('Failed to search forum posts');
    }
  }

  /**
   * Get popular posts in a category
   */
  static async getPopularPosts(
    category?: string,
    timeframe: 'day' | 'week' | 'month' = 'week',
    limit: number = 10
  ): Promise<ForumPostWithDetails[]> {
    try {
      const timeframeDays = {
        day: 1,
        week: 7,
        month: 30,
      };

      const since = new Date();
      since.setDate(since.getDate() - timeframeDays[timeframe]);

      const where: Prisma.ForumPostWhereInput = {
        status: 'active',
        createdAt: { gte: since },
      };

      if (category) {
        where.category = category;
      }

      const posts = await prisma.forumPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              votes: true,
            },
            take: 3,
          },
          votes: true,
        },
        orderBy: [
          { upvotes: 'desc' },
          { replyCount: 'desc' },
          { viewCount: 'desc' },
        ],
        take: limit,
      });

      return posts;
    } catch (error) {
      console.error('Error fetching popular posts:', error);
      throw new Error('Failed to fetch popular posts');
    }
  }

  /**
   * Get user's post history
   */
  static async getUserPosts(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ForumPostWithDetails[]> {
    try {
      const posts = await prisma.forumPost.findMany({
        where: {
          authorId: userId,
          status: { in: ['active', 'flagged'] },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              votes: true,
            },
            take: 3,
          },
          votes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return posts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw new Error('Failed to fetch user posts');
    }
  }

  /**
   * Get forum statistics
   */
  static async getForumStats() {
    try {
      const [totalPosts, totalReplies, activeUsers, popularCategories] = await Promise.all([
        prisma.forumPost.count({
          where: { status: 'active' },
        }),
        prisma.forumReply.count({
          where: { status: 'active' },
        }),
        prisma.forumPost.groupBy({
          by: ['authorId'],
          where: {
            status: 'active',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
          _count: true,
        }),
        prisma.forumPost.groupBy({
          by: ['category'],
          where: { status: 'active' },
          _count: true,
          orderBy: {
            _count: {
              category: 'desc',
            },
          },
          take: 5,
        }),
      ]);

      return {
        totalPosts,
        totalReplies,
        activeUsers: activeUsers.length,
        popularCategories: popularCategories.map(cat => ({
          category: cat.category,
          count: cat._count,
        })),
      };
    } catch (error) {
      console.error('Error fetching forum stats:', error);
      throw new Error('Failed to fetch forum statistics');
    }
  }
}