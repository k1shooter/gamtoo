import { LoginForm } from '@/components/login-form';
import { SupabaseLogo } from '@/components/supabase-logo';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden">
        {/* 왼쪽: 브랜딩/로고 영역 */}
        <div className="hidden md:flex flex-col gap-4 items-center justify-center p-10 bg-muted/50 border-r">
          <SupabaseLogo />
          <h1 className="text-2xl font-bold mt-4">Gamtoo 프로젝트</h1>
          <p className="text-muted-foreground text-center">
            Supabase와 Next.js로 만든 것을 환영합니다.
          </p>
        </div>

        {/* 오른쪽: 로그인 폼 영역 */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            {/* 실제 로그인 로직은 기존 폼을 재사용합니다. */}
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
