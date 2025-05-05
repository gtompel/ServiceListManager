import { getAllTags } from "@/lib/posts"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Теги</h1>
        <p className="text-gray-600">Просмотр всех тегов блога</p>
      </div>

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <Card key={tag.id}>
              <CardHeader>
                <CardTitle>#{tag.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {tag._count.posts} {tag._count.posts === 1 ? "публикация" : "публикаций"}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/tags/${tag.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                  Просмотреть публикации →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Теги не найдены</p>
        </div>
      )}
    </div>
  )
}
