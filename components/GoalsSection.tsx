"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/app/actions/goals";
import { updateGoalCompletionAction, addGoalAction } from "@/app/actions/goals";

type GoalCategory = "year" | "month" | "week";

interface GoalsSectionProps {
  category: GoalCategory;
  title: string;
  goals: Goal[];
}

export function GoalsSection({
  category,
  title,
  goals,
}: GoalsSectionProps) {
  const [input, setInput] = useState("");
  const [displayedGoals, setDisplayedGoals] = useState<Goal[]>(goals);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleGoal = (goalId: string, isCompleted: boolean) => {
    // Optimistic UI 업데이트
    setDisplayedGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, is_completed: !g.is_completed } : g
      )
    );

    // Server Action 호출 (백그라운드에서)
    startTransition(async () => {
      const result = await updateGoalCompletionAction(goalId, !isCompleted);
      if (!result.success) {
        console.error("목표 상태 업데이트 실패:", result.error);
        // 롤백: 원래 상태로 복원
        setDisplayedGoals(goals);
      }
      try {
        router.refresh();
      } catch {
        // ignore refresh errors
      }
    });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 입력창 초기화
    const inputValue = input;
    setInput("");

    // Optimistic: 임시 목표 생성
    const tempId = `temp-${Date.now()}`;
    const tempGoal: Goal = {
      id: tempId,
      user_id: "",
      category,
      title: inputValue,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDisplayedGoals((prev) => [tempGoal, ...prev]);

    startTransition(async () => {
      const result = await addGoalAction(category, inputValue);
      if (!result.success) {
        console.error("목표 추가 실패:", result.error);
        // 실패 시 임시 목표 제거 및 입력 복원
        setDisplayedGoals((prev) => prev.filter((g) => g.id !== tempId));
        setInput(inputValue);
        return;
      }

      // 성공하면 서버에서 반환한 목표로 교체
      if (result.goal) {
        setDisplayedGoals((prev) => {
          return prev.map((g) => (g.id === tempId ? result.goal! : g));
        });
      }

      // 서버 캐시 무효화 후 부모(Server Component) 재렌더링
      try {
        router.refresh();
      } catch {
        // ignore refresh errors
      }
    });
  };

  return (
    <Card className="p-6 border-0 bg-white rounded-lg">
      <h3 className="mb-4 text-base font-semibold text-slate-800">{title}</h3>

      <div className={`space-y-3 mb-4 ${isPending ? "opacity-60" : ""}`}>
        {displayedGoals.length === 0 ? (
          <p className="text-sm text-slate-400">목표가 없습니다</p>
        ) : (
          displayedGoals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={goal.is_completed}
                onChange={() => handleToggleGoal(goal.id, goal.is_completed)}
                disabled={isPending}
                className="w-4 h-4 rounded border-slate-300 cursor-pointer disabled:opacity-50"
              />
              <span
                className={`text-sm transition-all ${
                  goal.is_completed
                    ? "line-through text-slate-400"
                    : "text-slate-700"
                }`}
              >
                {goal.title}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddGoal} className="flex gap-2">
        <Input
          type="text"
          placeholder="새 목표 추가..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPending}
          className="text-sm h-9"
        />
        <Button
          type="submit"
          disabled={isPending || !input.trim()}
          className="h-9 bg-cyan-600 hover:bg-cyan-700 text-white text-sm disabled:opacity-50"
        >
          {isPending ? "처리 중..." : "추가"}
        </Button>
      </form>
    </Card>
  );
}
