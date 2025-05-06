export default function AboutPage() {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">О нас</h1>
          <p className="text-gray-600">
            Добро пожаловать на нашу блог-платформу, созданную с использованием современных технологий.
          </p>
        </div>
  
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Наша миссия</h2>
          <p>
            Наша миссия - предоставить простую и удобную платформу для публикации и обмена контентом. Мы стремимся создать
            сообщество, где авторы могут делиться своими знаниями, идеями и опытом.
          </p>
        </div>
  
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Технологии</h2>
          <p>Наша платформа построена с использованием следующих технологий:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Next.js - фреймворк для React с серверным рендерингом</li>
            <li>Prisma - ORM для работы с базой данных</li>
            <li>PostgreSQL - реляционная база данных</li>
            <li>Tailwind CSS - утилитарный CSS-фреймворк</li>
            <li>NextAuth.js - аутентификация для Next.js приложений</li>
          </ul>
        </div>
  
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Контакты</h2>
          <p>Если у вас есть вопросы или предложения, пожалуйста, свяжитесь с нами:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: info@blogplatform.ru</li>
            <li>Телефон: +7 (123) 456-7890</li>
          </ul>
        </div>
      </div>
    )
  }
  