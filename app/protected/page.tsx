import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile, test_note } from '@prisma/client';
import { AddNoteForm } from '@/components/AddNoteForm';

export default async function ProtectedPage() {
  const supabase = await createClient();

  // 1. Supabase 인증 확인
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // 2. 인증된 사용자의 ID(UUID) 확보
  const userId = data.claims.sub as string;

  // 3. Prisma를 사용해 'Profile' 테이블에서 사용자 역할(role) 조회
  const userProfile: Profile | null = await prisma.profile.findUnique({
    where: {
      id: userId,
    },
  });

  // 4. Prisma로 노트 데이터 조회 (로그 기준 'text' 컬럼 사용)
  const notes: test_note[] = await prisma.test_note.findMany({
    orderBy: {
      id: 'desc',
    },
  });

  return (
    // ⬇️ 이 <div>가 유일한 부모 요소(parent element)입니다.
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">
          My{' '}
          <span className="capitalize">
            {userProfile?.role.toLowerCase() ?? 'User'}
          </span>{' '}
          Dashboard
        </h1>

        {/* ⬇️ 5. (FIX) 여기에 있던 잘못된 텍스트를 삭제했습니다. */}
        <p className="text-muted-foreground">Welcome, {data.claims.email}.</p>
      </div>

      <AddNoteForm />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length > 0 ? (
          notes.map((note: test_note) => (
            <Card key={note.id.toString()}>
              <CardHeader>
                <CardTitle>{note.text ?? '내용 없음'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created at: {new Date(note.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full">
            표시할 노트가 없습니다. 새 노트를 추가해보세요.
          </p>
        )}
      </div>
    </div>
  );
}
