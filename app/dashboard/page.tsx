import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">Создать публикацию</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Публикации</CardTitle>
            <CardDescription>Всего публикаций</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user._count.posts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Комментарии</CardTitle>
            <CardDescription>Всего комментариев</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user._count.comments}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Управление профилем</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/profile">Редактировать профиль</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Последние публикации</h2>
        {user.posts.length > 0 ? (
          <div className="space-y-4">
            {user.posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        {formatDate(post.createdAt)} • {post.published ? "Опубликовано" : "Черновик"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/posts/${post.id}`}>Редактировать</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href={`/posts/${post.slug}`}>Просмотр</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 mb-4">У вас пока нет публикаций</p>
              <Button asChild>
                <Link href="/dashboard/posts/new">Создать первую публикацию</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {user.posts.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link href="/dashboard/posts">Все публикации</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
