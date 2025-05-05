import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Начало заполнения базы данных...")

  // Создаем администратора
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Администратор",
      email: "admin@example.com",
      password: adminPassword,
      bio: "Администратор блог-платформы",
    },
  })

  console.log("Создан пользователь:", admin.name)

  // Создаем категории
  const categories = [
    {
      name: "Технологии",
      slug: "technology",
      description: "Статьи о технологиях и инновациях",
    },
    {
      name: "Программирование",
      slug: "programming",
      description: "Статьи о программировании и разработке",
    },
    {
      name: "Дизайн",
      slug: "design",
      description: "Статьи о дизайне и UX/UI",
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    console.log("Создана категория:", category.name)
  }

  // Создаем теги
  const tags = [
    { name: "JavaScript", slug: "javascript" },
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "CSS", slug: "css" },
    { name: "UI", slug: "ui" },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
    console.log("Создан тег:", tag.name)
  }

  console.log("База данных успешно заполнена!")
}

main()
  .catch((e) => {
    console.error("Ошибка при заполнении базы данных:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
