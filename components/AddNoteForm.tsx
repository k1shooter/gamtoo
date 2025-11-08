'use client'; // 이 컴포넌트는 클라이언트(브라우저)에서 실행됩니다.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AddNoteForm() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 동작(새로고침) 방지
    if (!title) return; // 내용이 없으면 중단

    setIsLoading(true);

    try {
      // 1단계에서 만든 API 엔드포인트로 POST 요청을 보냅니다.
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }), // Input의 내용을 JSON으로 전송
      });

      if (!res.ok) {
        throw new Error('Failed to add note');
      }

      // 성공 시:
      setTitle(''); // Input 창 비우기

      // router.refresh()는 Next.js의 강력한 기능입니다.
      // 페이지 전체를 새로고침하지 않고,
      // 서버 컴포넌트(데이터 목록)만 새로 가져오게 합니다.
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('노트 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="text"
        placeholder="새 노트 내용..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : '추가'}
      </Button>
    </form>
  );
}
