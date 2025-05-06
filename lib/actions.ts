"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "./prisma"
import { slugify } from "./utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { hash } from "bcryptjs"
import { canEditPost } from "@/lib/auth"

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

export async function updateProfile(name: string, bio: string | null, image: string | null) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для обновления профиля")
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        image,
      },
    })

    revalidatePath("/dashboard/profile")
    return updatedUser
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error)
    throw new Error("Не удалось обновить профиль")
  }
}

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для создания публикации")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = (formData.get("excerpt") as string) || content.substring(0, 150) + "..."
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
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/posts")
    revalidatePath("/dashboard/drafts")
    revalidatePath("/admin/posts")

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

  // Проверяем права на редактирование
  const hasEditRights = await canEditPost(session.user.email, postId)
  if (!hasEditRights) {
    throw new Error("У вас нет прав для редактирования этой публикации")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = (formData.get("excerpt") as string) || content.substring(0, 150) + "..."
  const published = formData.get("published") === "true"

  // Получаем ID категорий и тегов из формы
  const categoryIds = formData.getAll("categories") as string[]
  const tagIds = formData.getAll("tags") as string[]

  // Проверяем, существует ли публикация
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
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/posts")
    revalidatePath("/dashboard/drafts")
    revalidatePath(`/dashboard/posts/${postId}`)
    revalidatePath("/admin/posts")

    return updatedPost
  } catch (error) {
    console.error("Ошибка при обновлении публикации:", error)
    throw new Error("Не удалось обновить публикацию")
  }
}

// Обновляем функцию для публикации черновика
export async function publishPost(postId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для публикации")
  }

  // Проверяем права на редактирование
  const hasEditRights = await canEditPost(session.user.email, postId)
  if (!hasEditRights) {
    throw new Error("У вас нет прав для публикации этой записи")
  }

  // Проверяем, существует ли публикация
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error("Публикация не найдена")
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        published: true,
      },
    })

    revalidatePath("/")
    revalidatePath("/posts")
    revalidatePath(`/posts/${post.slug}`)
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/posts")
    revalidatePath("/dashboard/drafts")
    revalidatePath(`/dashboard/posts/${postId}`)
    revalidatePath("/admin/posts")

    return updatedPost
  } catch (error) {
    console.error("Ошибка при публикации:", error)
    throw new Error("Не удалось опубликовать запись")
  }
}

// Обновляем функцию для отмены публикации
export async function unpublishPost(postId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для отмены публикации")
  }

  // Проверяем права на редактирование
  const hasEditRights = await canEditPost(session.user.email, postId)
  if (!hasEditRights) {
    throw new Error("У вас нет прав для отмены публикации этой записи")
  }

  // Проверяем, существует ли публикация
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error("Публикация не найдена")
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
      },
    })

    revalidatePath("/")
    revalidatePath("/posts")
    revalidatePath(`/posts/${post.slug}`)
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/posts")
    revalidatePath("/dashboard/drafts")
    revalidatePath(`/dashboard/posts/${postId}`)
    revalidatePath("/admin/posts")

    return updatedPost
  } catch (error) {
    console.error("Ошибка при отмене публикации:", error)
    throw new Error("Не удалось отменить публикацию")
  }
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для удаления публикации")
  }

  // Проверяем права на редактирование
  const hasEditRights = await canEditPost(session.user.email, postId)
  if (!hasEditRights) {
    throw new Error("У вас нет прав для удаления этой публикации")
  }

  // Проверяем, существует ли публикация
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new Error("Публикация не найдена")
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    })

    revalidatePath("/")
    revalidatePath("/posts")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/posts")
    revalidatePath("/dashboard/drafts")
    revalidatePath("/admin/posts")

    return { success: true }
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

export async function createCategory(name: string, description: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для создания категории")
  }

  const slug = slugify(name)

  // Проверяем, существует ли уже категория с таким slug
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  })

  if (existingCategory) {
    throw new Error("Категория с таким названием уже существует")
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    })

    revalidatePath("/categories")
    return category
  } catch (error) {
    console.error("Ошибка при создании категории:", error)
    throw new Error("Не удалось создать категорию")
  }
}

export async function createTag(name: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Вы должны войти в систему для создания тега")
  }

  const slug = slugify(name)

  // Проверяем, существует ли уже тег с таким slug
  const existingTag = await prisma.tag.findUnique({
    where: { slug },
  })

  if (existingTag) {
    throw new Error("Тег с таким названием уже существует")
  }

  try {
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    })

    revalidatePath("/tags")
    return tag
  } catch (error) {
    console.error("Ошибка при создании тега:", error)
    throw new Error("Не удалось создать тег")
  }
}
