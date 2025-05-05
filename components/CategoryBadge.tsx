import Link from "next/link"
import type { Category } from "@prisma/client"

export default function CategoryBadge({
  category,
  small = false,
}: {
  category: Category
  small?: boolean
}) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <span
        className={`
        inline-block bg-blue-100 text-blue-800 rounded-full
        ${small ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}
        hover:bg-blue-200 transition-colors
      `}
      >
        {category.name}
      </span>
    </Link>
  )
}
