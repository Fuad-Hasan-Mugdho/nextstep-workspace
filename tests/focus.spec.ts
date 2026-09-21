import { expect, test } from "@playwright/test";
import {
  advanceTimer,
  createTimer,
  parseTimer,
} from "../src/features/focus/timer";

test("timer validates state and settles the original deadline", () => {
  const start = new Date("2026-09-15T08:00:00.000Z").getTime();
  const running = {
    ...createTimer(),
    status: "running" as const,
    id: "session-1",
    deadline: start + 25 * 60_000,
  };
  const completed = advanceTimer(running, start + 50 * 60_000);
  expect(completed.status).toBe("completed");
  expect(completed.completedAt).toBe(
    new Date(start + 25 * 60_000).toISOString(),
  );
  expect(advanceTimer(completed, start + 60 * 60_000)).toBe(completed);
  expect(parseTimer(JSON.stringify(running))).toEqual(running);
  expect(parseTimer(JSON.stringify({ ...running, minutes: 999 }))).toBeNull();
  expect(parseTimer("{broken")).toBeNull();
});

test("focus completion counts once after pause, navigation and reload; breaks do not count", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/focus");
  await page
    .getByRole("button", { name: "Start 25m focus", exact: true })
    .click();
  await page.clock.fastForward(60_000);
  await page.getByRole("button", { name: "Pause timer", exact: true }).click();
  const paused = await page.getByRole("timer").textContent();
  await page.clock.fastForward(60_000);
  await expect(page.getByRole("timer")).toHaveText(paused!);
  await page.getByRole("button", { name: "Resume timer", exact: true }).click();
  await page.getByRole("link", { name: "Overview", exact: true }).click();
  await page.clock.fastForward(25 * 60_000);
  await page.getByRole("link", { name: "Focus room", exact: true }).click();
  await expect(page.getByTestId("focus-session-count")).toHaveText("1");
  await expect(page.getByTestId("focus-total-minutes")).toHaveText("25 min");
  await page.reload();
  await expect(page.getByTestId("focus-session-count")).toHaveText("1");
  await page.getByRole("button", { name: "Short break", exact: true }).click();
  await page
    .getByRole("button", { name: "Start 5m break", exact: true })
    .click();
  await page.clock.fastForward(5 * 60_000);
  await expect(page.getByRole("status")).toContainText("Break complete");
  await expect(page.getByTestId("focus-session-count")).toHaveText("1");
});

test("reset cancels unfinished focus and workspace reset does not resurrect an old timer", async ({
  page,
}) => {
  await page.goto("/focus");
  await page
    .getByRole("button", { name: "Start 25m focus", exact: true })
    .click();
  await page.getByRole("button", { name: "Reset timer", exact: true }).click();
  await expect(page.getByTestId("focus-session-count")).toHaveText("0");
  await expect(page.getByRole("timer")).toHaveText("25:00");
  await page.getByRole("button", { name: "15 min", exact: true }).click();
  await page
    .getByRole("button", { name: "Start 15m focus", exact: true })
    .click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page
    .getByRole("button", { name: "Reset all progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Yes, reset everything", exact: true })
    .click();
  await page.getByRole("link", { name: "Focus room", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start 25m focus", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("focus-session-count")).toHaveText("0");
});
