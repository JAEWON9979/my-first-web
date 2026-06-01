import { getAllGoalsAction, type Goal } from "@/app/actions/goals";
import { Card } from "@/components/ui/card";
import { GoalsSection } from "@/components/GoalsSection";

export const dynamic = "force-dynamic";

/**
 * 현재 월의 주차를 계산한다.
 */
function getCurrentWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  const dayOfMonth = date.getDate();
  
  // 0 = Sunday, 1 = Monday ... 일주일 시작을 월요일로 계산
  // 보정: 첫 주 시작 + 현재 날짜
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  return Math.ceil((dayOfMonth + adjustedFirstDay) / 7);
}

/**
 * 날짜를 한글로 포맷한다 (예: "2026년 5월 15일")
 */
function formatDateKorean(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/**
 * 진행률을 계산한다.
 */
function calculateProgress(
  goals: Goal[],
  category: string
): { completed: number; total: number; percentage: number } {
  const categoryGoals = goals.filter((g) => g.category === category);
  const completed = categoryGoals.filter((g) => g.is_completed).length;
  const total = categoryGoals.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percentage };
}

export default async function GoalsPage() {
  const today = new Date();
  const weekOfMonth = getCurrentWeekOfMonth(today);
  const monthName = today.getMonth() + 1;
  const year = today.getFullYear();

  const goals = await getAllGoalsAction();

  const yearProgress = calculateProgress(goals, "year");
  const monthProgress = calculateProgress(goals, "month");
  const weekProgress = calculateProgress(goals, "week");

  const yearGoals = goals.filter((g) => g.category === "year");
  const monthGoals = goals.filter((g) => g.category === "month");
  const weekGoals = goals.filter((g) => g.category === "week");

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-20">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-800 md:text-3xl">목표</h1>
          <p className="text-lg font-semibold text-cyan-700">{year} GOALS</p>
          <p className="text-base text-slate-600">
            목표 진행률 ({monthName}월 {weekOfMonth}주차)
          </p>
          <p className="text-sm text-slate-500 mt-1">
            오늘 날짜: {formatDateKorean(today)}
          </p>
        </div>

        {/* 프로그레스 바 섹션 */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* 년 목표 */}
          <Card className="p-4 bg-cyan-50 border-0">
            <p className="text-sm font-medium text-slate-700 mb-2">년 목표</p>
            <p className="text-xl font-bold text-slate-800 mb-3">
              {yearProgress.completed}/{yearProgress.total} ({yearProgress.percentage}%)
            </p>
            <div className="w-full bg-cyan-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${yearProgress.percentage}%` }}
              />
            </div>
          </Card>

          {/* 달 목표 */}
          <Card className="p-4 bg-cyan-50 border-0">
            <p className="text-sm font-medium text-slate-700 mb-2">
              달 목표
            </p>
            <p className="text-xl font-bold text-slate-800 mb-3">
              {monthProgress.completed}/{monthProgress.total} ({monthProgress.percentage}%)
            </p>
            <div className="w-full bg-cyan-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${monthProgress.percentage}%` }}
              />
            </div>
          </Card>

          {/* 주 목표 */}
          <Card className="p-4 bg-cyan-50 border-0">
            <p className="text-sm font-medium text-slate-700 mb-2">주 목표</p>
            <p className="text-xl font-bold text-slate-800 mb-3">
              {weekProgress.completed}/{weekProgress.total} ({weekProgress.percentage}%)
            </p>
            <div className="w-full bg-cyan-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${weekProgress.percentage}%` }}
              />
            </div>
          </Card>
        </div>

        {/* 목표 섹션들 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <GoalsSection
            category="year"
            title={`년 목표 (${year}년)`}
            goals={yearGoals}
          />
          <GoalsSection
            category="month"
            title={`달 목표 (오늘 목표: ${monthName}월 ${today.getDate()}일)`}
            goals={monthGoals}
          />
          <GoalsSection
            category="week"
            title={`주 목표 (${monthName}월 ${weekOfMonth}주차)`}
            goals={weekGoals}
          />
        </div>
      </div>
    </div>
  );
}
