import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment, User } from "@prisma/client"

type CommentWithUser = Comment & {
  author: User
}

export default function CommentList({ comments }: { comments: CommentWithUser[] }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Комментариев пока нет. Будьте первым, кто оставит комментарий!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author?.image || ""} alt={comment.author?.name || "Аватар"} />
            <AvatarFallback>{comment.author?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{comment.author?.name || "Анонимный пользователь"}</span>
              <span className="text-gray-500 text-sm">•</span>
              <time className="text-gray-500 text-sm" dateTime={comment.createdAt.toISOString()}>
                {formatDate(comment.createdAt)}
              </time>
            </div>

            <div className="text-gray-800">{comment.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
