import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';

// Функция для проверки, является ли пользователь администратором
export async function isAdmin(email: string): Promise<boolean> {
  if (!email) return false

  // Проверяем, является ли email администраторским
  return email === "admin@example.com"
}

// Функция для проверки прав на редактирование поста
export async function canEditPost(userEmail: string, postId: string): Promise<boolean> {
  if (!userEmail || !postId) return false

  // Проверяем, является ли пользователь администратором
  const isUserAdmin = await isAdmin(userEmail)
  if (isUserAdmin) return true

  // Если не администратор, проверяем, принадлежит ли пост пользователю
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })

  if (!post) return false

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  })

  return user?.id === post.authorId
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
