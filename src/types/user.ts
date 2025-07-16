export type UserRole = 'parent' | 'provider' | 'admin';

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
  }