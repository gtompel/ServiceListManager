import { getPostBySlug } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import CommentForm from "@/components/CommentForm"
import CommentList from "@/components/CommentList"
import CategoryBadge from "@/components/CategoryBadge"
import TagBadge from "@/components/TagBadge"
import { notFound } from "next/navigation"

export default async function PostPage({ params }: { params: { slug: string } }) {

  const slug = params.slug
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          <span>Автор: {post.author?.name || "Неизвестный автор"}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories &&
            post.categories.map(({ category }) => <CategoryBadge key={category.id} category={category} />)}
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags && post.tags.map(({ tag }) => <TagBadge key={tag.id} tag={tag} />)}
        </div>
      </header>

      <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Комментарии</h2>
        {post.comments && <CommentList comments={post.comments as any} />}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Оставить комментарий</h3>
          <CommentForm postId={post.id} />
        </div>
      </section>
    </article>
  )
}