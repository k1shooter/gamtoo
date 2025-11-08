import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  // 1. 인증 확인: data 객체를 먼저 받고, null 체크를 수행합니다.
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims(); // <--- 1차 분해

  // 2. data가 null이거나 claims가 없는 경우를 안전하게 확인 (이 부분이 핵심!)
  if (error || !data || !data.claims) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. 이 줄까지 왔다면 data.claims가 안전하게 존재함을 의미합니다.
  const claims = data.claims;

  try {
    // 4. 요청 본문(body)에서 'title' 데이터 추출
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // 5. Prisma를 사용해 'TestNote' 테이블에 새 레코드 생성
    const newNote = await prisma.test_note.create({
      data: {
        text: title,
        // 참고: user_id가 필요하다면 claims.sub (사용자 ID)를 사용하세요.
        // ex: userId: claims.sub
      },
    });

    const serializableNote = {
      ...newNote,
      id: newNote.id.toString(), // BigInt를 String으로 변환
    };

    // 6. 성공 응답 반환
    return NextResponse.json(serializableNote, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
