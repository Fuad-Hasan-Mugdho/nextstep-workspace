import { expect, test } from "@playwright/test";
import { courses } from "../src/features/courses/data";

test("global search, category filters, and empty results work", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("search")
    .getByLabel("Search courses")
    .fill("TypeScript");
  await page.getByRole("search").getByLabel("Search courses").press("Enter");
  await expect(page).toHaveURL(/courses\?q=TypeScript/);
  await expect(page.locator(".courses-grid .course-card")).toHaveCount(1);
  await expect(page.locator(".courses-grid")).toContainText(
    "TypeScript Toolkit",
  );
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("button", { name: "React", exact: true }).click();
  await expect(page.locator(".courses-grid .course-card")).toHaveCount(1);
  await expect(page.locator(".courses-grid")).toContainText("React Essentials");
  await page
    .locator("main")
    .getByLabel("Search courses")
    .fill("nothing-matches-this");
  await expect(
    page.getByRole("heading", { name: "No courses found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".courses-grid .course-card")).toHaveCount(4);
});

test("saved courses persist and can be removed", async ({ page }) => {
  await page.goto("/courses");
  await page
    .getByRole("button", { name: "Save React Essentials", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Saved courses", exact: true })
    .click();
  await expect(page.locator(".courses-grid .course-card")).toHaveCount(1);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Unsave React Essentials" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Unsave React Essentials" }).click();
  await expect(
    page.getByRole("heading", { name: "No saved courses match" }),
  ).toBeVisible();
});

test("lesson completion updates the dashboard and resumes at the next lesson", async ({
  page,
}) => {
  const course = courses[0];
  await page.goto(`/courses/${course.id}`);
  await expect(page.locator("#lesson-heading")).toHaveText(
    course.lessons[0].title,
  );
  await page
    .getByRole("button", { name: "Mark as Completed", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Completed", exact: true }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(
    page
      .locator(".stat-card")
      .filter({ hasText: "Lessons completed" })
      .locator("strong"),
  ).toHaveText("1");
  await page
    .getByRole("link", { name: `Continue ${course.title}`, exact: true })
    .click();
  await expect(page.locator("#lesson-heading")).toHaveText(
    course.lessons[1].title,
  );
  await page.reload();
  await expect(
    page.getByRole("progressbar", { name: "Course completion" }),
  ).toHaveAttribute("aria-valuenow", "25");
  await expect(page.locator("#lesson-heading")).toHaveText(
    course.lessons[1].title,
  );
});

test("public API filters summaries and unknown pages return 404", async ({
  request,
  page,
}) => {
  const response = await request.get("/api/courses?category=React");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.total).toBe(1);
  expect(body.courses[0]).toMatchObject({
    id: "react-essentials",
    lessonCount: 4,
  });
  expect(body.courses[0]).not.toHaveProperty("lessons");
  expect(
    await (await request.get("/api/courses?q=no-such-course")).json(),
  ).toMatchObject({ total: 0, courses: [] });
  expect(await (await request.get("/api/health")).json()).toMatchObject({
    status: "ok",
  });
  const missing = await page.goto("/courses/does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404");
});
