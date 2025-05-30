import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PublishPostButton } from "@/components/PublishPostButton"
import { DeletePostButton } from "@/components/DeletePostButton"

export default async function DraftsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/drafts")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: {
        where: {
          published: false,
        },
        orderBy: {
          updatedAt: "desc",
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
        <h1 className="text-3xl font-bold">Черновики</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">Создать публикацию</Link>
        </Button>
      </div>

      {user.posts.length > 0 ? (
        <div className="space-y-4">
          {user.posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>Последнее обновление: {formatDate(post.updatedAt)}</CardDescription>
                  </div>
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
                  <PublishPostButton postId={post.id} />
                  <DeletePostButton postId={post.id} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">У вас пока нет черновиков</p>
            <Button asChild>
              <Link href="/dashboard/posts/new">Создать публикацию</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
