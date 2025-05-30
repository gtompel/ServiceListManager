import { Badge } from "@/components/ui/badge"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { isAdmin } from "@/lib/auth"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin/users")
  }

  // Проверяем, является ли пользователь администратором
  const userIsAdmin = await isAdmin(session.user.email)
  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  // Получаем всех пользователей
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление пользователями</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-6">
        <p>
          <strong>Режим администратора:</strong> Вы можете просматривать информацию о всех пользователях.
        </p>
      </div>

      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || ""} alt={user.name || "Аватар пользователя"} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.name || "Без имени"}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Дата регистрации</p>
                    <p>{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Последнее обновление</p>
                    <p>{formatDate(user.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Публикаций</p>
                    <p>{user._count.posts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Комментариев</p>
                    <p>{user._count.comments}</p>
                  </div>
                </div>

                {user.bio && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">О себе</p>
                    <p className="mt-1">{user.bio}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/posts?userId=${user.id}`}>Публикации пользователя</Link>
                  </Button>
                </div>
                {user.email === "admin@example.com" && <Badge variant="secondary">Администратор</Badge>}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">Пользователи не найдены</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
