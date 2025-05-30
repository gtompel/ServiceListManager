import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">БлогПлатформа</h3>
            <p className="text-gray-600">
              Минималистичная блог-платформа, созданная с использованием Next.js, Prisma и PostgreSQL.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-600 hover:text-gray-900">
                  Публикации
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                  Категории
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-gray-600 hover:text-gray-900">
                  Теги
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: info@blogplatform.ru</li>
              <li className="text-gray-600">Телефон: +7 (123) 456-7890</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>© {new Date().getFullYear()} БлогПлатформа. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
