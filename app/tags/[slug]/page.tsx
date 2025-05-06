import { getPostsByTag } from "@/lib/posts"
import { prisma } from "@/lib/prisma"
import PostList from "@/components/PostList"
import { notFound } from "next/navigation"

// Аналогично исправляем ошибку с params.slug в маршруте тегов
export default async function TagPage({ params }: { params: { slug: string } }) {
  // Получаем slug из параметров и явно ожидаем его
  const { slug } = await Promise.resolve(params)

  // Получаем тег
  const tag = await prisma.tag.findUnique({
    where: { slug },
  })

  if (!tag) {
    notFound()
  }

  // Получаем публикации для этого тега
  const posts = await getPostsByTag(slug)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">#{tag.name}</h1>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Публикации с тегом</h2>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">С этим тегом пока нет публикаций</p>
          </div>
        )}
      </div>
    </div>
  )
}
