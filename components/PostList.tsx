import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import CategoryBadge from "./CategoryBadge"
import type { Post, User, Category, Tag } from "@prisma/client"

type CategoryWithDetails = {
  category: Category
}

type TagWithDetails = {
  tag: Tag
}
type UserMinimal = {
  id: string;
  name: string | null;
  email?: string;
  password?: string;
  bio?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  image: string | null;
};


type PostWithRelations = Post & {
  author: UserMinimal
  categories: CategoryWithDetails[]
  tags: TagWithDetails[]
  _count: { comments: number }
}

export default function PostList({ posts }: { posts: PostWithRelations[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Публикации не найдены</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href={`/posts/${post.slug}`}>
            <div className="aspect-video relative">
              <Image
                src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(post.title)}`}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {post.categories &&
                post.categories
                  .slice(0, 2)
                  .map(({ category }) => <CategoryBadge key={category.id} category={category} small />)}
            </div>

            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/posts/${post.slug}`} className="hover:text-gray-600">
                {post.title}
              </Link>
            </h2>

            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt || post.content.substring(0, 120) + "..."}</p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Автор: {post.author?.name || "Неизвестный автор"}</span>
              <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">{post._count?.comments || 0} комментариев</span>
              <Link href={`/posts/${post.slug}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Читать далее →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
