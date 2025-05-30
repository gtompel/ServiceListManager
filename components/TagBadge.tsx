import Link from "next/link"
import type { Tag } from "@prisma/client"

export default function TagBadge({
  tag,
  small = false,
}: {
  tag: Tag
  small?: boolean
}) {
  return (
    <Link href={`/tags/${tag.slug}`}>
      <span
        className={`
        inline-block bg-gray-100 text-gray-800 rounded-full
        ${small ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}
        hover:bg-gray-200 transition-colors
      `}
      >
        #{tag.name}
      </span>
    </Link>
  )
}
