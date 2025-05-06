import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PostForm from "@/components/PostForm"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/posts/" + params.id)
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/login")
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      categories: true,
      tags: true,
    },
  })

  if (!post) {
    notFound()
  }

  // Проверяем, принадлежит ли публикация пользователю
  if (post.authorId !== user.id) {
    redirect("/dashboard")
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
      <PostForm post={post} categories={categories} tags={tags} />
    </div>
  )
}
