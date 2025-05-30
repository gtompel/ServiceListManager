import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PostForm from "@/components/PostForm"
import { canEditPost } from "@/lib/auth"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  // Дожидаемся params перед использованием его свойств
  const id = params.id

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/posts/" + id)
  }

  // Проверяем права на редактирование
  const hasEditRights = await canEditPost(session.user.email, id)
  if (!hasEditRights) {
    redirect("/dashboard")
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      categories: true,
      tags: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // Получаем все категории и теги для формы
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Редактировать публикацию</h1>
      {post.author.email !== session.user.email && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-6">
          <p>
            <strong>Внимание:</strong> Вы редактируете публикацию пользователя {post.author.name} ({post.author.email})
          </p>
        </div>
      )}
      <PostForm post={post} categories={categories} tags={tags} />
    </div>
  )
}
