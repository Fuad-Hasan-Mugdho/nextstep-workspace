import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("profile survives direct reload, synchronizes tabs, and exports a backup", async ({
  page,
  context,
}) => {
  await page.goto("/settings");
  await page.getByLabel("Display name", { exact: true }).fill("Ayesha");
  await page.getByLabel("Weekly goal", { exact: true }).fill("7");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Settings saved");
  await page.reload();
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue(
    "Ayesha",
  );
  await expect(page.getByLabel("Weekly goal", { exact: true })).toHaveValue(
    "7",
  );
  const second = await context.newPage();
  await second.goto("/");
  await expect(second.getByRole("heading", { level: 1 })).toContainText(
    "Ayesha",
  );
  await page.getByLabel("Display name", { exact: true }).fill("Rafi");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(second.getByRole("heading", { level: 1 })).toContainText("Rafi");
  const downloaded = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export workspace", exact: true })
    .click();
  const download = await downloaded;
  const file = await download.path();
  expect(JSON.parse(await readFile(file!, "utf8"))).toMatchObject({
    version: 1,
    profile: { name: "Rafi", weeklyGoal: 7 },
  });
});

test("invalid profile inputs give feedback without crashing", async ({
  page,
}) => {
  await page.goto("/settings");
  await page.getByLabel("Display name", { exact: true }).fill("   ");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("1–40");
  await page.getByLabel("Display name", { exact: true }).fill("Valid Name");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Settings saved");
});

test("corrupt storage is preserved, exportable, and recoverable through explicit reset", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("nextstep-workspace-v1", "broken-original-json"),
  );
  await page.goto("/settings");
  await expect(
    page.getByRole("button", { name: "Export original data" }),
  ).toBeVisible();
  await page.getByLabel("Display name", { exact: true }).fill("Temporary");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("nextstep-workspace-v1")),
  ).toBe("broken-original-json");
  await page
    .getByRole("button", { name: "Reset all progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Yes, reset everything", exact: true })
    .click();
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue(
    "Mugdho",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Export original data" }),
  ).toHaveCount(0);
});

test("unavailable storage keeps the app usable and reports unsaved changes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    };
  });
  await page.goto("/settings");
  await page.getByLabel("Display name", { exact: true }).fill("Local Learner");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator(".storage-warning")).toContainText(
    "could not be saved",
  );
  await page.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Local");
});

test("notes support drafts, create, search, edit, and confirmed delete", async ({
  page,
}) => {
  await page.goto("/notes");
  await page.getByRole("button", { name: "New note", exact: true }).click();
  await page.getByLabel("Title", { exact: true }).fill("My first insight");
  await page
    .getByLabel("Your note", { exact: true })
    .fill("Server Components prepare UI on the server.");
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: /^My learning/ })
    .click();
  await page.getByRole("link", { name: "My notes", exact: true }).click();
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "My first insight",
  );
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "My first insight", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search notes", { exact: true }).fill("no match");
  await expect(
    page.getByRole("heading", { name: "No notes match just yet" }),
  ).toBeVisible();
  await page.getByLabel("Search notes", { exact: true }).fill("");
  await page
    .getByRole("button", { name: "Edit My first insight", exact: true })
    .click();
  await page.getByLabel("Title", { exact: true }).fill("Updated insight");
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  await page
    .getByRole("button", { name: "Delete Updated insight", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep it", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Updated insight", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete Updated insight", exact: true })
    .click();
  await page.getByRole("button", { name: "Delete note", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Updated insight", exact: true }),
  ).toHaveCount(0);
});

test("roadmap tasks can be completed, persisted and removed", async ({
  page,
}) => {
  await page.goto("/roadmap");
  await page
    .getByLabel("Your next step", { exact: true })
    .fill("Build a reusable button");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await page.getByRole("checkbox", { name: "Build a reusable button" }).check();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Build a reusable button" }),
  ).toBeChecked();
  await page
    .getByRole("button", { name: "Delete task: Build a reusable button" })
    .click();
  await page.getByRole("button", { name: "Remove task", exact: true }).click();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
});

test("server action rejects whitespace, retains fields, and validates corrected input", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel(/^Your name/).fill("  ");
  await page.getByLabel(/^Email address/).fill("learner@example.com");
  await page.getByLabel(/^Your message/).fill("          ");
  await page
    .getByRole("button", { name: "Run validation", exact: true })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Server validation",
  );
  await expect(page.getByLabel(/^Your name/)).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.getByLabel(/^Email address/)).toHaveValue(
    "learner@example.com",
  );
  await page.getByLabel(/^Your name/).fill("Ayesha Rahman");
  await page
    .getByLabel(/^Your message/)
    .fill("I understand server validation now.");
  await page
    .getByRole("button", { name: "Run validation", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Validation successful!",
  );
  await expect(page.getByRole("status")).toContainText("email পাঠায় না");
});
