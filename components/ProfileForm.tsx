"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/lib/actions"
import type { User } from "@prisma/client"

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [name, setName] = useState(user.name || "")
  const [bio, setBio] = useState(user.bio || "")
  const [image, setImage] = useState(user.image || "")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setIsLoading(true)
      await updateProfile(name, bio, image)
      setSuccess("Профиль успешно обновлен")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при обновлении профиля")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={image || ""} alt={name || "Аватар пользователя"} />
          <AvatarFallback className="text-2xl">{name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">URL изображения профиля</Label>
          <Input
            id="image"
            type="url"
            value={image || ""}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="text-sm text-gray-500">Введите URL изображения для вашего профиля</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">О себе</Label>
          <Textarea
            id="bio"
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите немного о себе..."
            className="min-h-[120px]"
          />
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{success}</div>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>
    </form>
  )
}
