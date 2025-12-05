import path from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import type { PrismaConfig } from 'prisma';

// Загружаем .env из корня проекта, т.к. при наличии prisma.config.ts Prisma не подхватывает .env автоматически
dotenvConfig({ path: path.resolve(process.cwd(), '.env') });

export default {
  schema: path.join('prisma'),
} satisfies PrismaConfig;
