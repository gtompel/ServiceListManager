import { getPostsByCategory } from "@/lib/posts"
import { prisma } from "@/lib/prisma"
import PostList from "@/components/PostList"
import { notFound } from "next/navigation"

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Дожидаемся params перед использованием его свойств
  const slug = params.slug

  // Получаем категорию
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    notFound()
  }

  // Получаем публикации для этой категории
  const posts = await getPostsByCategory(slug)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && <p className="text-gray-600">{category.description}</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Публикации в категории</h2>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">В этой категории пока нет публикаций</p>
          </div>
        )}
      </div>
    </div>
  )
}
