import { readFile } from "node:fs/promises";
import axe from "axe-core";
import { expect, test, type Locator } from "@playwright/test";
import { courses } from "../src/features/courses/data";
import { quizByLessonId } from "../src/features/quizzes/data";
import { initialWorkspace } from "../src/features/workspace/model";

const course = courses[0];
const firstLesson = course.lessons[0];
const firstQuiz = quizByLessonId[firstLesson.id];
const storageKey = "nextstep-workspace-v1";
type Questions = (typeof quizByLessonId)[string];

function questionGroup(
  region: Locator,
  question: Questions[number],
  index: number,
) {
  return region.getByRole("group", {
    name: `${index + 1}. ${question.prompt}`,
    exact: true,
  });
}

async function chooseAnswers(
  region: Locator,
  questions: Questions,
  wrongQuestion = -1,
) {
  for (const [index, question] of questions.entries()) {
    const choice =
      index === wrongQuestion
        ? (question.correctOption + 1) % question.options.length
        : question.correctOption;
    await questionGroup(region, question, index)
      .getByRole("radio", { name: question.options[choice], exact: true })
      .check();
  }
}

test("every lesson has three valid questions with unique choices and explanations", () => {
  const lessons = courses.flatMap((item) => item.lessons);
  expect(Object.keys(quizByLessonId).sort()).toEqual(
    lessons.map((lesson) => lesson.id).sort(),
  );
  const questionIds = new Set<string>();

  for (const lesson of lessons) {
    const questions = quizByLessonId[lesson.id];
    expect(questions).toHaveLength(3);
    for (const question of questions) {
      expect(question.id.trim()).not.toBe("");
      expect(questionIds.has(question.id)).toBe(false);
      questionIds.add(question.id);
      expect(question.prompt.trim()).not.toBe("");
      expect(question.options).toHaveLength(4);
      expect(
        new Set(question.options.map((option) => option.trim())).size,
      ).toBe(4);
      for (const option of question.options) expect(option.trim()).not.toBe("");
      expect(Number.isInteger(question.correctOption)).toBe(true);
      expect(question.correctOption).toBeGreaterThanOrEqual(0);
      expect(question.correctOption).toBeLessThan(question.options.length);
      expect(question.explanation.trim()).not.toBe("");
    }
  }
});

test("quiz guards incomplete answers, grades accessibly, and preserves the best score after retry and reload", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/courses/${course.id}`);
  const region = page.getByRole("region", { name: "Lesson quiz", exact: true });
  const submit = region.getByRole("button", {
    name: "Submit answers",
    exact: true,
  });
  await expect(submit).toBeDisabled();
  for (const question of firstQuiz) {
    await expect(
      region.getByText(question.explanation, { exact: true }),
    ).toBeHidden();
  }

  // Native radio groups must work without a pointer and keep one answer selected.
  const firstGroup = questionGroup(region, firstQuiz[0], 0);
  const firstRadio = firstGroup.getByRole("radio").nth(0);
  await expect(firstRadio).toBeEnabled();
  await firstRadio.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(firstGroup.getByRole("radio").nth(1)).toBeChecked();
  await expect(firstGroup.getByRole("radio", { checked: true })).toHaveCount(1);
  await expect(submit).toBeDisabled();

  await chooseAnswers(region, firstQuiz);
  await submit.click();
  await expect(region.getByRole("status")).toContainText("Score: 3 / 3 (100%)");
  await expect(region.locator(".quiz-history")).toContainText("Best: 100%");
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 1");
  await expect(firstRadio).toBeDisabled();
  await expect(
    page.getByRole("button", { name: `1. ${firstLesson.title}`, exact: true }),
  ).toHaveAccessibleDescription(/Quiz best: 100%/);
  await region.locator("form").dispatchEvent("submit");
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 1");

  await region.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(region.getByRole("radio", { checked: true })).toHaveCount(0);
  await expect(submit).toBeDisabled();
  await expect(region.getByText(/^Score:/)).toHaveCount(0);
  for (const question of firstQuiz) {
    await expect(
      region.getByText(question.explanation, { exact: true }),
    ).toBeHidden();
  }
  await expect(region.locator(".quiz-history")).toContainText("Best: 100%");
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 1");

  await chooseAnswers(region, firstQuiz, 2);
  await submit.click();
  await expect(region.getByRole("status")).toContainText("Score: 2 / 3 (67%)");
  for (const [index, question] of firstQuiz.entries()) {
    const group = questionGroup(region, question, index);
    await expect(group).toContainText(index === 2 ? "Incorrect" : "Correct");
    await expect(group).toContainText(question.explanation);
  }
  await expect(region.locator(".quiz-history")).toContainText("Best: 100%");
  await expect(region.locator(".quiz-history")).toContainText("Last: 67%");
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 2");

  // Scan the graded state too: success and error feedback introduce new colors.
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(async () => {
    const runner = (window as unknown as { axe: typeof axe }).axe;
    const result = await runner.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
    return result.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    }));
  });
  expect(violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await region.screenshot({
    path: testInfo.outputPath("quiz-mobile-result.png"),
  });

  await page.reload();
  await expect(region.locator(".quiz-history")).toContainText("Best: 100%");
  await expect(region.locator(".quiz-history")).toContainText("Last: 67%");
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 2");
  await expect(submit).toBeDisabled();
  const state = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    storageKey,
  );
  expect(state.quizResults[firstLesson.id]).toMatchObject({
    score: 67,
    bestScore: 100,
    attempts: 2,
  });
  expect(
    Number.isNaN(Date.parse(state.quizResults[firstLesson.id].attemptedAt)),
  ).toBe(false);
});

test("lesson navigation isolates answers and attempts while completion stays independent", async ({
  page,
}, testInfo) => {
  const secondLesson = course.lessons[1];
  const secondQuiz = quizByLessonId[secondLesson.id];
  await page.goto(`/courses/${course.id}`);
  const region = page.getByRole("region", { name: "Lesson quiz", exact: true });
  await region.screenshot({ path: testInfo.outputPath("quiz-desktop.png") });
  await chooseAnswers(region, firstQuiz);
  await region
    .getByRole("button", { name: "Submit answers", exact: true })
    .click();
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 1");
  await expect(
    page.getByRole("progressbar", { name: "Course completion" }),
  ).toHaveAttribute("aria-valuenow", "0");

  await page.getByRole("button", { name: "Next Lesson", exact: true }).click();
  await expect(page.locator("#lesson-heading")).toHaveText(secondLesson.title);
  await expect(region.getByRole("radio", { checked: true })).toHaveCount(0);
  await expect(region).not.toContainText("Attempts: 1");
  await questionGroup(region, secondQuiz[0], 0)
    .getByRole("radio")
    .first()
    .check();

  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(page.locator("#lesson-heading")).toHaveText(firstLesson.title);
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 1");
  await expect(region.getByRole("radio", { checked: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Next Lesson", exact: true }).click();
  await expect(region.getByRole("radio", { checked: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Mark as Completed", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Completed", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("progressbar", { name: "Course completion" }),
  ).toHaveAttribute("aria-valuenow", "25");
  const state = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    storageKey,
  );
  expect(Object.keys(state.quizResults)).toEqual([firstLesson.id]);
  expect(state.completedLessonIds).toEqual([secondLesson.id]);
});

test("legacy workspaces keep their data, include quizzes in exports, and clear results on reset", async ({
  page,
}) => {
  const legacy: Record<string, unknown> = {
    ...initialWorkspace,
    profile: { name: "Legacy Learner", weeklyGoal: 7 },
    completedLessonIds: [courses[1].lessons[0].id],
  };
  delete legacy.quizResults;
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: storageKey, value: legacy },
  );
  await page.goto(`/courses/${course.id}`);
  const region = page.getByRole("region", { name: "Lesson quiz", exact: true });
  await chooseAnswers(region, firstQuiz);
  await region
    .getByRole("button", { name: "Submit answers", exact: true })
    .click();
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 1");
  await expect(region.locator(".quiz-storage-warning")).toBeHidden();

  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue(
    "Legacy Learner",
  );
  await expect(page.getByLabel("Weekly goal", { exact: true })).toHaveValue(
    "7",
  );
  const downloaded = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export workspace", exact: true })
    .click();
  const file = await (await downloaded).path();
  const backup = JSON.parse(await readFile(file!, "utf8"));
  expect(backup).toMatchObject({
    version: 1,
    profile: legacy.profile,
    completedLessonIds: legacy.completedLessonIds,
    quizResults: {
      [firstLesson.id]: { score: 100, bestScore: 100, attempts: 1 },
    },
  });

  await page
    .getByRole("button", { name: "Reset all progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Yes, reset everything", exact: true })
    .click();
  await page.goto(`/courses/${course.id}`);
  await expect(region.getByRole("radio").first()).toBeEnabled();
  await expect(region).not.toContainText("Attempts: 1");
  await expect(region.getByRole("radio", { checked: true })).toHaveCount(0);
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).quizResults,
      storageKey,
    ),
  ).toEqual({});
});

test("quiz feedback stays usable and reports when results only last for this visit", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    };
  });
  await page.goto(`/courses/${course.id}`);
  const region = page.getByRole("region", { name: "Lesson quiz", exact: true });
  await chooseAnswers(region, firstQuiz);
  await region
    .getByRole("button", { name: "Submit answers", exact: true })
    .click();
  await expect(region.getByRole("status")).toContainText("Score: 3 / 3 (100%)");
  await expect(region.locator(".quiz-storage-warning")).toContainText(
    "this visit",
  );
  await expect(region.locator(".quiz-history")).toContainText("Attempts: 1");
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBeNull();
});
