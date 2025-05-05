import { getAllCategories } from "@/lib/posts"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Категории</h1>
        <p className="text-gray-600">Просмотр всех категорий блога</p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>
                  {category._count.posts} {category._count.posts === 1 ? "публикация" : "публикаций"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{category.description || "Нет описания"}</p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Просмотреть публикации →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Категории не найдены</p>
        </div>
      )}
    </div>
  )
}
