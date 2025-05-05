import Link from "next/link"
import { UserNav } from "./UserNav"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          БлогПлатформа
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-600">
            Главная
          </Link>
          <Link href="/posts" className="hover:text-gray-600">
            Публикации
          </Link>
          <Link href="/categories" className="hover:text-gray-600">
            Категории
          </Link>
          <Link href="/about" className="hover:text-gray-600">
            О нас
          </Link>
        </nav>

        <UserNav />
      </div>
    </header>
  )
}
