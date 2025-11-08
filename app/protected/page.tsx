import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 1. Prisma 타입과 2단계에서 만든 폼을 import
import { test_note } from '@prisma/client';
import { AddNoteForm } from '@/components/AddNoteForm'; // (방금 만든 폼)

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const notes: test_note[] = await prisma.test_note.findMany({
    orderBy: {
      id: 'desc',
    },
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">내 대시보드</h1>
        <p className="text-muted-foreground">
          Prisma로 Supabase DB에서 불러온 데이터입니다.
        </p>
      </div>

      {/* 2. 여기에 폼 컴포넌트를 추가합니다. */}
      <AddNoteForm />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length > 0 ? (
          notes.map((note: test_note) => (
            <Card key={note.id.toString()}>
              <CardHeader>
                <CardTitle>Note #{note.id.toString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{note.text ?? '내용 없음'}</p>
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
