import { createClient } from "@/lib/supabase/client";

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
      return {
        message: error.message || "로그인에 실패했습니다.",
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
    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (error) {
      return {
        message: error.message || "회원가입에 실패했습니다.",
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
 * 현재 로그인된 사용자를 로그아웃한다.
 * @returns 성공 시 { success: true }, 실패 시 { message: string }
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        message: error.message || "로그아웃에 실패했습니다.",
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
