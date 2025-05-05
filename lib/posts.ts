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
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
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
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
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
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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

export async function getAllCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Ошибка при получении категорий:", error)
    return []
  }
}

export async function getAllTags() {
  try {
    return await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Ошибка при получении тегов:", error)
    return []
  }
}
