import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeletePostButton } from "@/components/DeletePostButton"
import { PublishPostButton } from "@/components/PublishPostButton"
import { isAdmin } from "@/lib/auth"

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin/posts")
  }

  // Проверяем, является ли пользователь администратором
  const userIsAdmin = await isAdmin(session.user.email)
  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  // Получаем все посты всех пользователей
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление публикациями</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">Создать публикацию</Link>
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-6">
        <p>
          <strong>Режим администратора:</strong> Вы можете редактировать, публиковать и удалять публикации всех
          пользователей.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      {formatDate(post.createdAt)} • {post._count.comments} комментариев
                    </CardDescription>
                    <CardDescription className="mt-1">
                      Автор: <span className="font-medium">{post.author.name}</span> ({post.author.email})
                    </CardDescription>
                  </div>
                  <Badge variant={post.published ? "default" : "outline"}>
                    {post.published ? "Опубликовано" : "Черновик"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-2">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/posts/${post.id}`}>Редактировать</Link>
                  </Button>
                  <PublishPostButton postId={post.id} isPublished={post.published} />
                  <DeletePostButton postId={post.id} />
                </div>
                {post.published && (
                  <Button variant="secondary" asChild>
                    <Link href={`/posts/${post.slug}`}>Просмотр</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">Публикации не найдены</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
