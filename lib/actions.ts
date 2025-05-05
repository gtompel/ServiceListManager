"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "./prisma"
import { slugify } from "./utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { hash } from "bcryptjs"
export async function registerUser(name: string, email: string, password: string) {
  // Проверяем, существует ли пользователь с таким email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует")
  }

  // Хешируем пароль
  const hashedPassword = await hash(password, 10)

  // Создаем нового пользователя
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return user
}

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для создания публикации")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const published = formData.get("published") === "true"

  // Получаем ID категорий и тегов из формы
  const categoryIds = formData.getAll("categories") as string[]
  const tagIds = formData.getAll("tags") as string[]

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("Пользователь не найден")
  }

  const slug = slugify(title)

  // Проверяем, существует ли уже публикация с таким slug
  const existingPost = await prisma.post.findUnique({
    where: { slug },
  })

  if (existingPost) {
    throw new Error("Публикация с таким заголовком уже существует")
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        authorId: user.id,
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
        tags: {
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
    })

    revalidatePath("/")
    revalidatePath("/posts")

    return post
  } catch (error) {
    console.error("Ошибка при создании публикации:", error)
    throw new Error("Не удалось создать публикацию")
  }
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для обновления публикации")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const published = formData.get("published") === "true"

  // Получаем ID категорий и тегов из формы
  const categoryIds = formData.getAll("categories") as string[]
  const tagIds = formData.getAll("tags") as string[]

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("Пользователь не найден")
  }

  // Проверяем, принадлежит ли публикация пользователю
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      categories: true,
      tags: true,
    },
  })

  if (!post) {
    throw new Error("Публикация не найдена")
  }

  if (post.authorId !== user.id) {
    throw new Error("У вас нет прав для редактирования этой публикации")
  }

  try {
    // Обновляем публикацию
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        excerpt,
        published,
        categories: {
          deleteMany: {},
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
    })

    revalidatePath("/")
    revalidatePath("/posts")
    revalidatePath(`/posts/${post.slug}`)

    return updatedPost
  } catch (error) {
    console.error("Ошибка при обновлении публикации:", error)
    throw new Error("Не удалось обновить публикацию")
  }
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для удаления публикации")
  }


  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("Пользователь не найден")
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error("Публикация не найдена")
  }

  if (post.authorId !== user.id) {
    throw new Error("У вас нет прав для удаления этой публикации")
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    })

    revalidatePath("/")
    revalidatePath("/posts")

    redirect("/dashboard")
  } catch (error) {
    console.error("Ошибка при удалении публикации:", error)
    throw new Error("Не удалось удалить публикацию")
  }
}
export async function createComment(postId: string, content: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для создания комментария")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("Пользователь не найден")
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: user.id,
        postId,
      },
    })

    revalidatePath(`/posts/[slug]`)

    return comment
  } catch (error) {
    console.error("Ошибка при создании комментария:", error)
    throw new Error("Не удалось создать комментарий")
  }
}
