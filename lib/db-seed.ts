import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

const categories = [
  { name: "Разработка", slug: "development", description: "Статьи о программировании и разработке" },
  { name: "Дизайн", slug: "design", description: "Статьи о UI/UX и графическом дизайне" },
  { name: "Маркетинг", slug: "marketing", description: "Статьи о маркетинге и продвижении" },
  { name: "Бизнес", slug: "business", description: "Статьи о бизнесе и предпринимательстве" },
  { name: "Технологии", slug: "tech", description: "Новости и обзоры технологий" },
  { name: "Карьера", slug: "career", description: "Советы по развитию карьеры" },
  { name: "Обучение", slug: "education", description: "Материалы для обучения" },
  { name: "Интервью", slug: "interviews", description: "Интервью с экспертами" },
]

const tags = [
  { name: "JavaScript", slug: "javascript" },
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Python", slug: "python" },
  { name: "Django", slug: "django" },
  { name: "Flask", slug: "flask" },
  { name: "UI/UX", slug: "ui-ux" },
  { name: "Figma", slug: "figma" },
  { name: "SEO", slug: "seo" },
  { name: "SMM", slug: "smm" },
  { name: "Startup", slug: "startup" },
  { name: "AI", slug: "ai" },
  { name: "ML", slug: "ml" },
  { name: "DevOps", slug: "devops" },
  { name: "Docker", slug: "docker" },
  { name: "Kubernetes", slug: "kubernetes" },
  { name: "Testing", slug: "testing" },
  { name: "Security", slug: "security" },
]

const users = [
  {
    name: "Иван Петров",
    email: "ivan@example.com",
    password: "password123",
    role: "ADMIN",
    bio: "Ведущий разработчик с 10-летним опытом",
  },
  {
    name: "Мария Сидорова",
    email: "maria@example.com",
    password: "password123",
    role: "USER",
    bio: "UI/UX дизайнер и маркетолог",
  },
  {
    name: "Алексей Иванов",
    email: "alex@example.com",
    password: "password123",
    role: "USER",
    bio: "Full-stack разработчик",
  },
  {
    name: "Елена Смирнова",
    email: "elena@example.com",
    password: "password123",
    role: "USER",
    bio: "Технический писатель",
  },
  {
    name: "Дмитрий Козлов",
    email: "dmitry@example.com",
    password: "password123",
    role: "USER",
    bio: "DevOps инженер",
  },
]

const posts = [
  {
    title: "Введение в TypeScript",
    content: `
      <h2>Что такое TypeScript?</h2>
      <p>TypeScript - это типизированный надмножество JavaScript, которое компилируется в чистый JavaScript.</p>
      <h2>Преимущества TypeScript</h2>
      <ul>
        <li>Статическая типизация</li>
        <li>Улучшенная поддержка IDE</li>
        <li>Объектно-ориентированное программирование</li>
      </ul>
    `,
    excerpt: "Подробное руководство по TypeScript для начинающих разработчиков",
    published: true,
    categorySlug: "development",
    tagSlugs: ["typescript", "javascript"],
    authorEmail: "ivan@example.com",
  },
  {
    title: "Современный UI/UX дизайн",
    content: `
      <h2>Основы UI/UX дизайна</h2>
      <p>Современный дизайн интерфейсов требует глубокого понимания пользовательского опыта.</p>
      <h2>Тренды 2024</h2>
      <ul>
        <li>Минимализм</li>
        <li>Темные темы</li>
        <li>Микроанимации</li>
      </ul>
    `,
    excerpt: "Актуальные тренды в UI/UX дизайне на 2024 год",
    published: true,
    categorySlug: "design",
    tagSlugs: ["ui-ux", "figma"],
    authorEmail: "maria@example.com",
  },
  {
    title: "DevOps практики",
    content: `
      <h2>Что такое DevOps?</h2>
      <p>DevOps - это методология, объединяющая разработку и эксплуатацию.</p>
      <h2>Основные инструменты</h2>
      <ul>
        <li>Docker</li>
        <li>Kubernetes</li>
        <li>CI/CD</li>
      </ul>
    `,
    excerpt: "Практическое руководство по внедрению DevOps",
    published: true,
    categorySlug: "tech",
    tagSlugs: ["devops", "docker", "kubernetes"],
    authorEmail: "dmitry@example.com",
  },
  {
    title: "React Hooks: Полное руководство",
    content: `
      <h2>Что такое Hooks?</h2>
      <p>Hooks - это новый способ использования состояния и других возможностей React.</p>
      <h2>Основные хуки</h2>
      <ul>
        <li>useState</li>
        <li>useEffect</li>
        <li>useContext</li>
      </ul>
    `,
    excerpt: "Подробное руководство по React Hooks",
    published: true,
    categorySlug: "development",
    tagSlugs: ["react", "javascript"],
    authorEmail: "alex@example.com",
  },
  {
    title: "SEO оптимизация в 2024",
    content: `
      <h2>Основы SEO</h2>
      <p>Поисковая оптимизация - ключевой фактор успеха любого веб-проекта.</p>
      <h2>Современные тренды</h2>
      <ul>
        <li>Core Web Vitals</li>
        <li>Мобильная оптимизация</li>
        <li>Контент-маркетинг</li>
      </ul>
    `,
    excerpt: "Актуальные методы SEO оптимизации",
    published: true,
    categorySlug: "marketing",
    tagSlugs: ["seo", "marketing"],
    authorEmail: "elena@example.com",
  },
]

const comments = [
  {
    content: "Отличная статья! Очень помогло разобраться с TypeScript.",
    authorEmail: "maria@example.com",
  },
  {
    content: "Спасибо за подробное объяснение. Буду пробовать на практике.",
    authorEmail: "alex@example.com",
  },
  {
    content: "Интересный взгляд на современный дизайн. Согласен с автором.",
    authorEmail: "dmitry@example.com",
  },
  {
    content: "Хорошая статья, но можно было бы добавить больше примеров кода.",
    authorEmail: "elena@example.com",
  },
]

async function main() {
  console.log("Начало заполнения базы данных...")

  // Создаем категории
  console.log("Создание категорий...")
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Создаем теги
  console.log("Создание тегов...")
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }

  // Создаем пользователей
  console.log("Создание пользователей...")
  for (const user of users) {
    const hashedPassword = await hash(user.password, 10)
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: hashedPassword,
      },
    })
  }

  // Создаем посты
  console.log("Создание постов...")
  for (const post of posts) {
    const author = await prisma.user.findUnique({
      where: { email: post.authorEmail },
    })
    const category = await prisma.category.findUnique({
      where: { slug: post.categorySlug },
    })

    if (!author || !category) {
      console.log(`Пропуск поста ${post.title}: автор или категория не найдены`)
      continue
    }

    try {
      const slug = post.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Math.random().toString(36).substring(2, 8)

      // Сначала создаем пост
      const createdPost = await prisma.post.create({
        data: {
          title: post.title,
          slug,
          content: post.content,
          excerpt: post.excerpt,
          published: post.published,
          authorId: author.id,
          categories: {
            create: [{
              category: {
                connect: { slug: post.categorySlug }
              }
            }]
          }
        },
      })

      // Затем добавляем теги
      for (const tagSlug of post.tagSlugs) {
        const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } })
        if (!tag) {
          console.log(`Тег не найден: ${tagSlug}`)
          continue
        }

        await prisma.tagOnPost.create({
          data: {
            postId: createdPost.id,
            tagId: tag.id
          }
        })
      }

      // Добавляем комментарии к посту
      console.log(`Добавление комментариев к посту ${post.title}...`)
      for (const comment of comments) {
        const commentAuthor = await prisma.user.findUnique({
          where: { email: comment.authorEmail },
        })

        if (!commentAuthor) {
          console.log(`Пропуск комментария: автор не найден`)
          continue
        }

        await prisma.comment.create({
          data: {
            content: comment.content,
            authorId: commentAuthor.id,
            postId: createdPost.id,
          },
        })
      }
    } catch (error) {
      console.error(`Ошибка при создании поста ${post.title}:`, error)
    }
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
