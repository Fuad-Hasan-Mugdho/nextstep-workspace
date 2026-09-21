"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import {
  advanceTimer,
  timerMemory,
  createTimer,
  parseTimer,
  remainingMilliseconds,
  TIMER_STORAGE_KEY,
  timerPresets,
  type TimerMode,
  type TimerState,
} from "./timer";
import "./focus.css";

// This fallback retains the timer during route navigation if tab storage is
// blocked. It cannot retain it through a full browser reload.

function readTimer(): { timer: TimerState; storageIssue: string } {
  try {
    const raw = sessionStorage.getItem(TIMER_STORAGE_KEY);
    const saved = raw ? parseTimer(raw) : null;
    if (raw && !saved)
      return {
        timer: createTimer(),
        storageIssue:
          "The previous timer could not be restored. Start a new session below.",
      };
    const timer = advanceTimer(saved ?? createTimer(), Date.now());
    return { timer, storageIssue: "" };
  } catch {
    return {
      timer: advanceTimer(timerMemory.current ?? createTimer(), Date.now()),
      storageIssue:
        "Timer backup is unavailable. Keep this tab open; a full reload may lose this timer.",
    };
  }
}

function FocusTimer() {
  const { state, addFocusSession } = useWorkspace();
  const [initial] = useState(readTimer);
  const [timer, setTimer] = useState(initial.timer);
  const [storageIssue, setStorageIssue] = useState(initial.storageIssue);
  const [now, setNow] = useState(() => Date.now());
  const active = timer.status === "running" || timer.status === "paused";
  const remaining = remainingMilliseconds(timer, now);
  const seconds = Math.ceil(remaining / 1000);
  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const percent = Math.min(
    100,
    Math.max(0, (1 - remaining / (timer.minutes * 60_000)) * 100),
  );
  const totalMinutes = state.sessions.reduce(
    (sum, session) => sum + session.minutes,
    0,
  );
  const today = new Date(now).toDateString();
  const todaySessions = state.sessions.filter(
    (session) => new Date(session.date).toDateString() === today,
  );
  const recent = [...state.sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  function commit(next: TimerState, timestamp: number) {
    timerMemory.current = next;
    try {
      sessionStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(next));
      setStorageIssue("");
    } catch {
      setStorageIssue(
        "Timer backup is unavailable. Keep this tab open; a full reload may lose this timer.",
      );
    }
    setTimer(next);
    setNow(timestamp);
  }

  // The workspace deduplicates the stable session id, including Strict Mode
  // remounts and restored timers. Preserve the actual deadline as the date.
  useEffect(() => {
    if (
      timer.status === "completed" &&
      timer.mode === "focus" &&
      timer.id &&
      timer.completedAt
    ) {
      addFocusSession(timer.minutes, timer.id, timer.completedAt);
    }
  }, [timer, addFocusSession]);

  useEffect(() => {
    if (timer.status !== "running") return;
    const tick = () => {
      const timestamp = Date.now();
      const next = advanceTimer(timer, timestamp);
      setNow(timestamp);
      if (next !== timer) {
        timerMemory.current = next;
        try {
          sessionStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(next));
        } catch {
          setStorageIssue(
            "Timer backup is unavailable. Keep this tab open; a full reload may lose this timer.",
          );
        }
        setTimer(next);
      }
    };
    const immediate = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 250);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(interval);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [timer]);

  useEffect(() => {
    const reset = () => {
      timerMemory.current = null;
      setTimer(createTimer());
      setNow(Date.now());
      setStorageIssue("");
    };
    window.addEventListener("nextstep:reset", reset);
    return () => window.removeEventListener("nextstep:reset", reset);
  }, []);

  // A reset cancels unfinished time. Settle first if the deadline already passed
  // but a throttled browser has not yet delivered its interval callback.
  function settle(timestamp: number) {
    const current = advanceTimer(timer, timestamp);
    if (
      current.status === "completed" &&
      current.mode === "focus" &&
      current.id &&
      current.completedAt
    )
      addFocusSession(current.minutes, current.id, current.completedAt);
    return current;
  }

  function toggleTimer() {
    const timestamp = Date.now();
    const current = settle(timestamp);
    if (current.status === "running") {
      commit(
        {
          ...current,
          remainingMs: remainingMilliseconds(current, timestamp),
          deadline: null,
          status: "paused",
        },
        timestamp,
      );
    } else if (current.status === "paused" || current.status === "idle") {
      commit(
        {
          ...current,
          id: current.id ?? crypto.randomUUID(),
          deadline: timestamp + current.remainingMs,
          status: "running",
        },
        timestamp,
      );
    } else if (timer.status === "running") {
      commit(current, timestamp);
    } else {
      const fresh = createTimer(current.mode, current.minutes);
      commit(
        {
          ...fresh,
          id: crypto.randomUUID(),
          deadline: timestamp + fresh.remainingMs,
          status: "running",
        },
        timestamp,
      );
    }
  }

  function resetTimer() {
    const timestamp = Date.now();
    settle(timestamp);
    commit(createTimer(timer.mode, timer.minutes), timestamp);
  }

  function chooseMode(mode: TimerMode) {
    if (active) return;
    commit(createTimer(mode), Date.now());
  }

  const status =
    timer.status === "completed"
      ? timer.mode === "focus"
        ? "Session complete. Well done!"
        : "Break complete. Welcome back."
      : timer.status === "paused"
        ? "Paused. Take your time."
        : timer.status === "running"
          ? timer.mode === "focus"
            ? "One thing at a time. You've got this."
            : "Step away, stretch, and breathe."
          : timer.mode === "focus"
            ? "A little focus goes a long way."
            : "A small pause for a fresh start.";

  return (
    <div className="focus-workspace">
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE SPACE TO LEARN</div>
          <h1>Focus Room</h1>
          <p className="page-subtitle">
            One clear intention. A little uninterrupted time. A step forward.
          </p>
        </div>
        <span className="focus-heading-note">
          <Icon name="coffee" size={17} /> Settle in. You belong here.
        </span>
      </div>
      <div className="focus-workspace-grid">
        <section className="panel focus-main-panel" aria-label="Focus timer">
          <div className="focus-mode-switch" aria-label="Timer mode">
            <button
              className={timer.mode === "focus" ? "is-selected" : ""}
              aria-pressed={timer.mode === "focus"}
              disabled={active}
              onClick={() => chooseMode("focus")}
            >
              <Icon name="target" size={17} /> Focus
            </button>
            <button
              className={timer.mode === "break" ? "is-selected" : ""}
              aria-pressed={timer.mode === "break"}
              disabled={active}
              onClick={() => chooseMode("break")}
            >
              <Icon name="coffee" size={17} /> Short break
            </button>
          </div>
          <div
            className={`focus-clock-ring ${timer.mode === "break" ? "is-break" : ""}`}
          >
            <svg viewBox="0 0 240 240" aria-hidden="true">
              <circle className="focus-ring-track" cx="120" cy="120" r="110" />
              <circle
                className="focus-ring-progress"
                cx="120"
                cy="120"
                r="110"
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset={100 - percent}
              />
            </svg>
            <div className="focus-clock-content">
              <span className="focus-clock-eyebrow">
                {timer.mode === "focus" ? "TIME TO FOCUS" : "TAKE A BREATHER"}
              </span>
              <span
                className="focus-clock-time"
                role="timer"
                aria-label={`${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds remaining`}
                aria-live="off"
              >
                {formatted}
              </span>
              <span className="focus-clock-state">
                {timer.status === "running"
                  ? "In progress"
                  : timer.status === "paused"
                    ? "Paused"
                    : timer.status === "completed"
                      ? "Completed"
                      : "Ready when you are"}
              </span>
            </div>
          </div>
          <p className="focus-message" role="status">
            {status}
          </p>
          <div className="focus-preset-list" aria-label="Timer duration">
            {timerPresets[timer.mode].map((minutes) => (
              <button
                key={minutes}
                disabled={active}
                aria-pressed={timer.minutes === minutes}
                className={timer.minutes === minutes ? "is-selected" : ""}
                onClick={() =>
                  commit(createTimer(timer.mode, minutes), Date.now())
                }
              >
                {minutes} min
              </button>
            ))}
          </div>
          <div className="focus-action-row">
            <button
              className={`button ${timer.status === "running" ? "button-secondary" : "button-dark"}`}
              onClick={toggleTimer}
            >
              <Icon
                name={timer.status === "running" ? "pause" : "play"}
                size={18}
              />
              {timer.status === "running"
                ? "Pause timer"
                : timer.status === "paused"
                  ? "Resume timer"
                  : timer.status === "completed"
                    ? "Start another session"
                    : `Start ${timer.minutes}m ${timer.mode === "focus" ? "focus" : "break"}`}
            </button>
            <button
              className="button button-ghost"
              onClick={resetTimer}
              aria-label="Reset timer"
            >
              <Icon name="reset" size={18} /> Reset
            </button>
          </div>
          {active && (
            <p className="focus-helper">
              Reset to cancel this session or change its duration.
            </p>
          )}
          {timer.status === "completed" && (
            <button
              className="button button-ghost focus-next-mode"
              onClick={() =>
                chooseMode(timer.mode === "focus" ? "break" : "focus")
              }
            >
              {timer.mode === "focus"
                ? "Ready for a short break?"
                : "Ready to focus again?"}
              <Icon name="arrow-right" size={16} />
            </button>
          )}
          {storageIssue && (
            <p className="focus-storage-warning" role="status">
              {storageIssue}
            </p>
          )}
        </section>
        <aside className="focus-side-panels">
          <section className="panel focus-today-panel">
            <div className="focus-panel-title">
              <h2>Your quiet progress</h2>
              <Icon name="flame" size={19} />
            </div>
            <div className="focus-summary-stats">
              <div>
                <strong data-testid="focus-session-count">
                  {state.sessions.length}
                </strong>
                <span>Sessions completed</span>
              </div>
              <div>
                <strong data-testid="focus-total-minutes">
                  {totalMinutes}
                  <small> min</small>
                </strong>
                <span>Total focus time</span>
              </div>
            </div>
            <div className="focus-today-strip">
              <Icon name="check-circle" size={17} />
              <span>
                {todaySessions.length
                  ? `${todaySessions.length} ${todaySessions.length === 1 ? "session" : "sessions"} · ${todaySessions.reduce((sum, item) => sum + item.minutes, 0)} minutes today`
                  : "Your first session today is waiting."}
              </span>
            </div>
          </section>
          <section className="panel focus-history-panel">
            <h2>Recent sessions</h2>
            {recent.length ? (
              <ul>
                {recent.map((session) => (
                  <li key={session.id}>
                    <span className="focus-history-icon">
                      <Icon name="check" size={16} />
                    </span>
                    <div>
                      <strong>{session.minutes} minutes of focus</strong>
                      <time dateTime={session.date}>
                        {new Date(session.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <span className="focus-history-done">Done</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="focus-history-empty">
                <Icon name="clock" size={25} />
                <p>
                  Your finished focus sessions will appear here. Make this one
                  count.
                </p>
              </div>
            )}
          </section>
          <section className="focus-how-it-works">
            <h2>A rhythm that works for you</h2>
            <ol>
              <li>Choose one lesson or task before you start.</li>
              <li>Focus until the timer finishes, then take a short break.</li>
              <li>Come back refreshed and keep your momentum.</li>
            </ol>
            <p>
              Your timer keeps counting as you navigate or reload this tab.
              Return here to record a finished session. Only completed focus
              sessions count; breaks and cancelled timers don’t. Pausing keeps
              your remaining time.
            </p>
            <Link href="/courses" className="button button-ghost">
              Find your next lesson <Icon name="arrow-right" size={16} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function FocusWorkspace() {
  const { hydrated } = useWorkspace();
  return hydrated ? (
    <FocusTimer />
  ) : (
    <div className="panel empty-state" role="status">
      Getting your focus room ready…
    </div>
  );
}
