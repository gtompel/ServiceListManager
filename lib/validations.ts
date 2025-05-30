import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  categoryId: z.string().uuid(),
  tags: z.array(z.string().uuid()),
});

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(8),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
}); 