import PostList from "@/components/PostList"
import { getPosts } from "@/lib/posts"


export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Добро пожаловать в блог</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Минималистичная блог-платформа, созданная с использованием Next.js, Prisma и PostgreSQL
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Последние публикации</h2>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="text-center text-gray-500 py-10">Публикации не найдены</p>
        )}
      </section>
    </div>
  )
}
