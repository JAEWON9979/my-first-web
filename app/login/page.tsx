"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithEmail } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email: string; password: string }>({ email: "", password: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // client-side validation
    const nextErrors = { email: "", password: "" };
    if (!email.trim()) nextErrors.email = "이메일을 입력하세요.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) nextErrors.email = "유효한 이메일을 입력하세요.";
    if (!password) nextErrors.password = "비밀번호를 입력하세요.";
    else if (password.length < 6) nextErrors.password = "비밀번호는 최소 6자입니다.";

    setFieldErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setIsLoading(true);

    const result = await signInWithEmail(email.trim(), password);

    if ("success" in result) {
      toast.success("로그인되었습니다.");
      // 전체 페이지 네비게이션으로 변경: 세션 쿠키가 서버로 확실히 전달되도록 함
      window.location.assign("/posts");
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <main className="relative -top-[6px] mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center px-4 py-12 md:px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {fieldErrors.email ? <p className="mt-1 text-sm text-rose-600">{fieldErrors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {fieldErrors.password ? <p className="mt-1 text-sm text-rose-600">{fieldErrors.password}</p> : null}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/signup" className="text-primary hover:underline font-medium">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}