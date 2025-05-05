import { prisma } from "./prisma"

export async function getPosts(limit = 10) {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Ошибка при получении публикаций:", error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Ошибка при получении публикации:", error)
    return null
  }
}

export async function getPostsByCategory(categorySlug: string, limit = 10) {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
        categories: {
          some: {
            category: {
              slug: categorySlug,
            },
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Ошибка при получении публикаций по категории:", error)
    return []
  }
}

export async function getPostsByTag(tagSlug: string, limit = 10) {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
        tags: {
          some: {
            tag: {
              slug: tagSlug,
            },
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Ошибка при получении публикаций по тегу:", error)
    return []
  }
}
