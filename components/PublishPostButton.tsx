"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { publishPost, unpublishPost } from "@/lib/actions"

type PublishPostButtonProps = {
  postId: string
  isPublished?: boolean
}

export function PublishPostButton({ postId, isPublished = false }: PublishPostButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handlePublish = async () => {
    try {
      setIsLoading(true)
      if (isPublished) {
        await unpublishPost(postId)
      } else {
        await publishPost(postId)
      }
      router.refresh()
    } catch (error) {
      console.error("Ошибка при изменении статуса публикации:", error)
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={isPublished ? "outline" : "default"}>{isPublished ? "В черновики" : "Опубликовать"}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isPublished ? "Перевести в черновики?" : "Опубликовать запись?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isPublished
              ? "Запись будет скрыта от читателей и перемещена в черновики."
              : "Запись станет доступна для всех читателей."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handlePublish} disabled={isLoading}>
            {isLoading
              ? isPublished
                ? "Перемещение..."
                : "Публикация..."
              : isPublished
                ? "Переместить в черновики"
                : "Опубликовать"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
