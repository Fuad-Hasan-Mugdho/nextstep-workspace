"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  updateWorkspace,
} from "./store";
import { timerMemory } from "@/features/focus/timer";
import { initialWorkspace, type Note, type WorkspaceState } from "./model";

const actions = {
  enrollCourse: (id: string) =>
    updateWorkspace((state) => ({
      ...state,
      enrolledCourseIds: [...new Set([...state.enrolledCourseIds, id])],
    })),
  completeLesson: (id: string) =>
    updateWorkspace((state) =>
      state.completedLessonIds.includes(id)
        ? state
        : {
            ...state,
            completedLessonIds: [...state.completedLessonIds, id],
            lessonCompletedAt: {
              ...state.lessonCompletedAt,
              [id]: new Date().toISOString(),
            },
          },
    ),
  toggleBookmark: (id: string) =>
    updateWorkspace((state) => ({
      ...state,
      bookmarks: state.bookmarks.includes(id)
        ? state.bookmarks.filter((item) => item !== id)
        : [...state.bookmarks, id],
    })),
  addNote: (input: Pick<Note, "title" | "content" | "tag">) =>
    updateWorkspace((state) => ({
      ...state,
      notes: [
        {
          ...input,
          id: crypto.randomUUID(),
          updatedAt: new Date().toISOString(),
        },
        ...state.notes,
      ],
    })),
  updateNote: (id: string, input: Pick<Note, "title" | "content" | "tag">) =>
    updateWorkspace((state) => ({
      ...state,
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, ...input, updatedAt: new Date().toISOString() }
          : note,
      ),
    })),
  deleteNote: (id: string) =>
    updateWorkspace((state) => ({
      ...state,
      notes: state.notes.filter((note) => note.id !== id),
    })),
  addTask: (title: string) =>
    updateWorkspace((state) => ({
      ...state,
      tasks: [
        ...state.tasks,
        { id: crypto.randomUUID(), title: title.trim(), done: false },
      ],
    })),
  toggleTask: (id: string) =>
    updateWorkspace((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    })),
  deleteTask: (id: string) =>
    updateWorkspace((state) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  addFocusSession: (
    minutes: number,
    sessionId = crypto.randomUUID(),
    completedAt = new Date().toISOString(),
  ) =>
    updateWorkspace((state) =>
      state.sessions.some((session) => session.id === sessionId)
        ? state
        : {
            ...state,
            sessions: [
              ...state.sessions,
              { id: sessionId, minutes, date: completedAt },
            ],
          },
    ),
  updateProfile: (profile: WorkspaceState["profile"]) =>
    updateWorkspace((state) => ({ ...state, profile })),
  recordQuizResult: (lessonId: string, score: number) =>
    updateWorkspace((state) => {
      const previous = state.quizResults[lessonId];
      return {
        ...state,
        quizResults: {
          ...state.quizResults,
          [lessonId]: {
            score,
            bestScore: Math.max(previous?.bestScore ?? 0, score),
            attempts: (previous?.attempts ?? 0) + 1,
            attemptedAt: new Date().toISOString(),
          },
        },
      };
    }),
  resetData: () => {
    timerMemory.current = null;
    updateWorkspace(() => ({ ...initialWorkspace }), { reset: true });
    try {
      sessionStorage.removeItem("nextstep-note-draft-v1");
      sessionStorage.removeItem("nextstep-focus-timer-v1");
    } catch {
      /* Storage unavailable: the reset event still clears mounted state. */
    }
    window.dispatchEvent(new Event("nextstep:reset"));
  },
};

// useSyncExternalStore server HTML ও browser hydration একই রাখে।
// ছোট app-এ আলাদা state library ছাড়াই সব page একই store ব্যবহার করে।
export function useWorkspace() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { ...snapshot, ...actions };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { storageError } = useWorkspace();
  return (
    <>
      {storageError && (
        <div className="storage-warning" role="status">
          {storageError}
        </div>
      )}
      {children}
    </>
  );
}
