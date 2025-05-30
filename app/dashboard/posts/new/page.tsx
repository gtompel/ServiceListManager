import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PostForm from "@/components/PostForm"

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/posts/new")
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
      <h1 className="text-3xl font-bold mb-6">Создать новую публикацию</h1>
      <PostForm categories={categories} tags={tags} />
    </div>
  )
}
