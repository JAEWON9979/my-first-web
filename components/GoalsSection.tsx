"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/app/actions/goals";
import {
  addGoalAction,
  deleteGoalAction,
  updateGoalCompletionAction,
  updateGoalTitleAction,
} from "@/app/actions/goals";

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
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setDisplayedGoals(goals);
  }, [goals]);

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

  const handleStartEdit = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditingTitle(goal.title);
  };

  const handleCancelEdit = () => {
    setEditingGoalId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = (goalId: string) => {
    const nextTitle = editingTitle.trim();
    if (!nextTitle) return;

    const previousGoals = displayedGoals;
    setDisplayedGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, title: nextTitle, updated_at: new Date().toISOString() }
          : goal
      )
    );
    setEditingGoalId(null);
    setEditingTitle("");

    startTransition(async () => {
      const result = await updateGoalTitleAction(goalId, nextTitle);
      if (!result.success) {
        console.error("목표 수정 실패:", result.error);
        setDisplayedGoals(previousGoals);
        return;
      }

      if (result.goal) {
        setDisplayedGoals((prev) =>
          prev.map((goal) => (goal.id === goalId ? result.goal! : goal))
        );
      }

      try {
        router.refresh();
      } catch {
        // ignore refresh errors
      }
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!window.confirm("이 목표를 삭제할까요?")) {
      return;
    }

    const previousGoals = displayedGoals;
    setDisplayedGoals((prev) => prev.filter((goal) => goal.id !== goalId));

    startTransition(async () => {
      const result = await deleteGoalAction(goalId);
      if (!result.success) {
        console.error("목표 삭제 실패:", result.error);
        setDisplayedGoals(previousGoals);
        return;
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
    <Card className="rounded-lg border-0 bg-white p-4 sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-800">{title}</h3>

      <div className={`mb-4 space-y-3 ${isPending ? "opacity-60" : ""}`}>
        {displayedGoals.length === 0 ? (
          <p className="text-sm text-slate-400">목표가 없습니다</p>
        ) : (
          displayedGoals.map((goal) => (
            <div key={goal.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={goal.is_completed}
                onChange={() => handleToggleGoal(goal.id, goal.is_completed)}
                disabled={isPending}
                className="w-4 h-4 rounded border-slate-300 cursor-pointer disabled:opacity-50"
              />
              {editingGoalId === goal.id ? (
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    disabled={isPending}
                    className="h-8 w-full text-sm"
                  />
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="secondary"
                    disabled={isPending || !editingTitle.trim()}
                    onClick={() => handleSaveEdit(goal.id)}
                    aria-label="목표 수정 저장"
                  >
                    <Check />
                  </Button>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    disabled={isPending}
                    onClick={handleCancelEdit}
                    aria-label="목표 수정 취소"
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <>
                  <span
                    className={`min-w-0 flex-1 break-words text-sm transition-all ${
                      goal.is_completed
                        ? "line-through text-slate-400"
                        : "text-slate-700"
                    }`}
                  >
                    {goal.title}
                  </span>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleStartEdit(goal)}
                    aria-label="목표 수정"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => handleDeleteGoal(goal.id)}
                    aria-label="목표 삭제"
                  >
                    <Trash2 />
                  </Button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddGoal} className="flex gap-2 sm:flex-row">
        <Input
          type="text"
          placeholder="새 목표 추가..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPending}
          className="h-9 min-w-0 flex-1 text-sm"
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
