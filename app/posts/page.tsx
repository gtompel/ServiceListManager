import { getPosts } from "@/lib/posts"
import PostList from "@/components/PostList"

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Все публикации</h1>
        <p className="text-gray-600">Просмотр всех публикаций блога</p>
      </div>

      <div>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Публикации не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
