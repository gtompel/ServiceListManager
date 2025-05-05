"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createComment } from "@/lib/actions"

export default function CommentForm({ postId }: { postId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.href))
      return
    }

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      await createComment(postId, content)
      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Ошибка при отправке комментария:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="mb-4">Чтобы оставить комментарий, необходимо войти в систему</p>
        <Button onClick={() => router.push("/login?callbackUrl=" + encodeURIComponent(window.location.href))}>
          Войти
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Напишите ваш комментарий..."
        className="min-h-[100px]"
        required
      />
      <Button type="submit" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? "Отправка..." : "Отправить комментарий"}
      </Button>
    </form>
  )
}
