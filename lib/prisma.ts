import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// PrismaClient 인스턴스를 생성하는 함수
const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

// 전역 객체에 prisma 인스턴스를 저장하기 위한 타입 선언
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// prisma 인스턴스를 내보냅니다.
// 개발 중 핫 리로드 시 인스턴스가 여러 개 생성되는 것을 방지합니다.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
