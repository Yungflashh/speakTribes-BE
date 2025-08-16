import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: 'spanish-a1' },
    update: {},
    create: {
      title: 'Spanish A1 Basics',
      slug: 'spanish-a1',
      fromLang: 'en',
      toLang: 'es',
      level: 'A1',
      lessons: {
        create: [
          { index: 0, title: 'Greetings', content: { text: 'Hola — basics' }, durationSec: 180 },
          { index: 1, title: 'Numbers 1-10', content: { text: 'uno, dos, tres' }, durationSec: 150 }
        ]
      }
    }
  });
  console.log('Seeded:', course.slug);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
