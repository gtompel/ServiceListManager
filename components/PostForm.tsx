"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createPost, updatePost } from "@/lib/actions"
import type { Category, Post, Tag } from "@prisma/client"

type PostFormProps = {
  post?: Post & {
    categories: { categoryId: string }[]
    tags: { tagId: string }[]
  }
  categories: Category[]
  tags: Tag[]
}

export default function PostForm({ post, categories, tags }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [published, setPublished] = useState(post?.published || false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map((c) => c.categoryId) || [],
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags.map((t) => t.tagId) || [])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title || !content) {
      setError("Заголовок и содержание обязательны")
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("excerpt", excerpt)
      formData.append("published", published.toString())

      selectedCategories.forEach((categoryId) => {
        formData.append("categories", categoryId)
      })

      selectedTags.forEach((tagId) => {
        formData.append("tags", tagId)
      })

      if (post) {
        await updatePost(post.id, formData)
      } else {
        await createPost(formData)
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при сохранении публикации")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleTagChange = (tagId: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок публикации"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Содержание</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Введите содержание публикации..."
          className="min-h-[300px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Краткое описание</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Введите краткое описание публикации..."
          className="min-h-[100px]"
        />
        <p className="text-sm text-gray-500">Если не указано, будет использовано начало содержания публикации</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Категории</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Теги</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => handleTagChange(tag.id)}
                />
                <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                  {tag.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="published" checked={published} onCheckedChange={(checked) => setPublished(checked as boolean)} />
        <Label htmlFor="published" className="cursor-pointer">
          Опубликовать сразу
        </Label>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : post ? "Обновить публикацию" : "Создать публикацию"}
        </Button>
      </div>
    </form>
  )
}
