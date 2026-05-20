"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/errors";

export type Goal = {
  id: string;
  user_id: string;
  category: "year" | "month" | "week";
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

type GoalActionClient = {
  supabase: ReturnType<typeof createServerClient>;
  user: { id: string };
};

async function getGoalActionClient(): Promise<GoalActionClient> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as never);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  return { supabase, user };
}

/**
 * 모든 목표를 조회한다 (Server Action)
 */
export async function getAllGoalsAction(): Promise<Goal[]> {
  try {
    const { supabase, user } = await getGoalActionClient();

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(getFriendlyErrorMessage(error));
    }

    return (data as Goal[]) || [];
  } catch (error) {
    console.error("목표 조회 실패:", error);
    return [];
  }
}

/**
 * 목표를 추가한다 (Server Action)
 */
export async function addGoalAction(
  category: "year" | "month" | "week",
  title: string
): Promise<{ success: boolean; goal?: Goal; error?: string }> {
  try {
    if (!title.trim()) {
      return { success: false, error: "목표 제목을 입력해주세요." };
    }

    const { supabase, user } = await getGoalActionClient();

    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        category,
        title: title.trim(),
        is_completed: false,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: getFriendlyErrorMessage(error) };
    }

    return { success: true, goal: data as Goal };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}

/**
 * 목표 제목을 수정한다 (Server Action)
 */
export async function updateGoalTitleAction(
  goalId: string,
  title: string
): Promise<{ success: boolean; goal?: Goal; error?: string }> {
  try {
    if (!title.trim()) {
      return { success: false, error: "목표 제목을 입력해주세요." };
    }

    const { supabase, user } = await getGoalActionClient();

    const { data, error } = await supabase
      .from("goals")
      .update({
        title: title.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: getFriendlyErrorMessage(error) };
    }

    return { success: true, goal: data as Goal };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}

/**
 * 목표 완료 상태를 업데이트한다 (Server Action)
 */
export async function updateGoalCompletionAction(
  goalId: string,
  isCompleted: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getGoalActionClient();

    const { error } = await supabase
      .from("goals")
      .update({
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: getFriendlyErrorMessage(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}

/**
 * 목표를 삭제한다 (Server Action)
 */
export async function deleteGoalAction(
  goalId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getGoalActionClient();

    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goalId)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "오류가 발생했습니다.";
    return { success: false, error: message };
  }
}
