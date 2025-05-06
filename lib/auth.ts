import { prisma } from "./prisma"

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
