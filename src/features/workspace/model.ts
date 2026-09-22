import { z } from "zod";

// Browser থেকে আসা data-ও বিশ্বাস করি না: Zod দিয়ে shape যাচাই করি।
const noteSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  content: z.string().max(20000),
  tag: z.string().trim().max(40),
  updatedAt: z.iso.datetime(),
});
const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  done: z.boolean(),
});
const sessionSchema = z.object({
  id: z.string(),
  date: z.iso.datetime(),
  minutes: z.number().min(1).max(180),
});
export const profileSchema = z.object({
  name: z.string().trim().min(1).max(40),
  weeklyGoal: z.number().int().min(1).max(30),
});
const quizResultSchema = z
  .object({
    score: z.number().int().min(0).max(100),
    bestScore: z.number().int().min(0).max(100),
    attempts: z.number().int().min(1),
    attemptedAt: z.iso.datetime(),
  })
  .refine((result) => result.bestScore >= result.score);
export const workspaceSchema = z.object({
  version: z.literal(1),
  profile: profileSchema,
  completedLessonIds: z.array(z.string()),
  lessonCompletedAt: z.record(z.string(), z.iso.datetime()).default({}),
  enrolledCourseIds: z.array(z.string()),
  bookmarks: z.array(z.string()),
  notes: z.array(noteSchema),
  tasks: z.array(taskSchema),
  sessions: z.array(sessionSchema),
  // পুরোনো v1 workspace-এ quizResults নেই; default আগের data অক্ষত রাখে।
  quizResults: z.record(z.string(), quizResultSchema).default({}),
});
export type WorkspaceState = z.infer<typeof workspaceSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Task = z.infer<typeof taskSchema>;
export type FocusSession = z.infer<typeof sessionSchema>;
export const initialWorkspace: WorkspaceState = {
  version: 1,
  profile: { name: "Mugdho", weeklyGoal: 5 },
  completedLessonIds: [],
  lessonCompletedAt: {},
  enrolledCourseIds: [],
  bookmarks: [],
  notes: [],
  tasks: [],
  sessions: [],
  quizResults: {},
};

export function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}
