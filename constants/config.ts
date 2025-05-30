export const API_ROUTES = {
  POSTS: '/api/posts',
  USERS: '/api/users',
  CATEGORIES: '/api/categories',
  TAGS: '/api/tags',
} as const;

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export const CACHE = {
  REVALIDATE_TIME: 60 * 60, // 1 hour
} as const; 