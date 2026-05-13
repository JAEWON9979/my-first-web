import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AuthError = {
  message: string;
  code?: string;
};

export type AuthSuccess = {
  success: true;
};

export type AuthResponse = AuthSuccess | AuthError;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isAuthError(response: AuthResponse): response is AuthError {
  return "message" in response && !("success" in response);
}

/**
 * Supabase 에러 메시지를 사용자 친화적인 한글로 번역한다.
 * @param errorMessage Supabase에서 반환한 영어 에러 메시지
 * @returns 번역된 한글 메시지
 */
function translateErrorMessage(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    "email rate limit exceeded": "이메일 발송 제한을 초과했습니다. 잠시 후 다시 시도해 주세요.",
    "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
    "User already registered": "이미 가입된 이메일입니다.",
    "Password should be at least 6 characters": "비밀번호는 최소 6자 이상이어야 합니다.",
    "Email not confirmed": "이메일 인증이 필요합니다.",
  };

  // 정확한 매칭 확인
  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // 매칭되지 않으면 기본 메시지 반환
  return "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}

async function syncProfile(user: User, username: string) {
  const supabase = createClient();

  return supabase.from("profiles").upsert(
    {
      id: user.id,
      username,
    },
    { onConflict: "id" }
  );
}

/**
 * 이메일/비밀번호로 로그인한다.
 * @param email 이메일 주소
 * @param password 비밀번호
 * @returns 성공 시 { success: true }, 실패 시 { message: string }
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return {
        message: "이메일과 비밀번호를 모두 입력해주세요.",
      };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (error) {
      const translatedMessage = translateErrorMessage(error.message);
      return {
        message: translatedMessage,
        code: error.code,
      };
    }

    const {
      data: { user: signedInUser },
    } = await supabase.auth.getUser();

    if (signedInUser) {
      const { error: profileError } = await syncProfile(signedInUser, signedInUser.email ?? trimmedEmail);

      if (profileError) {
        return {
          message: profileError.message || "프로필 동기화에 실패했습니다.",
          code: profileError.code,
        };
      }
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return { message };
  }
}

/**
 * 이메일/비밀번호로 회원가입한다.
 * @param email 이메일 주소
 * @param password 비밀번호
 * @returns 성공 시 { success: true }, 실패 시 { message: string }
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return {
        message: "이메일과 비밀번호를 모두 입력해주세요.",
      };
    }

    if (trimmedPassword.length < 6) {
      return {
        message: "비밀번호는 최소 6자 이상이어야 합니다.",
      };
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (error) {
      const translatedMessage = translateErrorMessage(error.message);
      return {
        message: translatedMessage,
        code: error.code,
      };
    }

    if (data.user) {
      const { error: profileError } = await syncProfile(data.user, trimmedEmail);

      if (profileError) {
        return {
          message: profileError.message || "프로필 저장에 실패했습니다.",
          code: profileError.code,
        };
      }
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return { message };
  }
}

/**
 * 현재 로그인된 사용자를 로그아웃한다.
 * @returns 성공 시 { success: true }, 실패 시 { message: string }
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      const translatedMessage = translateErrorMessage(error.message);
      return {
        message: translatedMessage,
        code: error.code,
      };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return { message };
  }
}

/**
 * 현재 로그인된 사용자 정보를 가져온다.
 * @returns 사용자 객체 또는 null
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}
