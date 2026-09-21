export type TimerMode = "focus" | "break";
export type TimerState = {
  id: string | null;
  mode: TimerMode;
  minutes: number;
  remainingMs: number;
  deadline: number | null;
  status: "idle" | "running" | "paused" | "completed";
  completedAt: string | null;
};

export const timerMemory: { current: TimerState | null } = { current: null };

export const TIMER_STORAGE_KEY = "nextstep-focus-timer-v1";
export const timerPresets: Record<TimerMode, number[]> = {
  focus: [15, 25, 50],
  break: [5, 10],
};

export function createTimer(
  mode: TimerMode = "focus",
  minutes = mode === "focus" ? 25 : 5,
): TimerState {
  return {
    id: null,
    mode,
    minutes,
    remainingMs: minutes * 60_000,
    deadline: null,
    status: "idle",
    completedAt: null,
  };
}

// A deadline stays accurate when browsers throttle callbacks in hidden tabs.
export function remainingMilliseconds(timer: TimerState, now: number): number {
  return Math.max(
    0,
    timer.deadline === null ? timer.remainingMs : timer.deadline - now,
  );
}

export function advanceTimer(timer: TimerState, now: number): TimerState {
  if (
    timer.status !== "running" ||
    timer.deadline === null ||
    timer.deadline > now
  )
    return timer;
  return {
    ...timer,
    remainingMs: 0,
    deadline: null,
    status: "completed",
    completedAt: new Date(timer.deadline).toISOString(),
  };
}

export function parseTimer(raw: string): TimerState | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const timer = value as Partial<TimerState>;
    if (timer.mode !== "focus" && timer.mode !== "break") return null;
    if (
      typeof timer.minutes !== "number" ||
      !timerPresets[timer.mode].includes(timer.minutes)
    )
      return null;
    if (
      typeof timer.remainingMs !== "number" ||
      !Number.isFinite(timer.remainingMs) ||
      timer.remainingMs < 0 ||
      timer.remainingMs > timer.minutes * 60_000
    )
      return null;
    if (
      !["idle", "running", "paused", "completed"].includes(timer.status ?? "")
    )
      return null;
    if (
      timer.id !== null &&
      (typeof timer.id !== "string" ||
        timer.id.length < 1 ||
        timer.id.length > 100)
    )
      return null;
    if (timer.status !== "idle" && !timer.id) return null;
    if (timer.status === "running") {
      if (
        typeof timer.deadline !== "number" ||
        !Number.isFinite(timer.deadline) ||
        timer.deadline <= 0 ||
        timer.deadline > 8.64e15
      )
        return null;
    } else if (timer.deadline !== null) return null;
    if (timer.status === "completed") {
      if (
        timer.remainingMs !== 0 ||
        typeof timer.completedAt !== "string" ||
        !Number.isFinite(Date.parse(timer.completedAt)) ||
        new Date(timer.completedAt).toISOString() !== timer.completedAt
      )
        return null;
    } else if (timer.completedAt !== null) return null;
    if (timer.status === "paused" && timer.remainingMs === 0) return null;
    if (timer.status === "idle" && timer.remainingMs !== timer.minutes * 60_000)
      return null;
    return timer as TimerState;
  } catch {
    return null;
  }
}
