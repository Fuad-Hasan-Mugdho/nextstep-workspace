import axe from "axe-core";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/courses",
  "/courses/nextjs-fundamentals",
  "/roadmap",
  "/notes",
  "/focus",
  "/settings",
  "/about",
  "/contact",
];

for (const route of routes) {
  test(`WCAG automated checks: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.addScriptTag({ content: axe.source });
    const issues = await page.evaluate(async () => {
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
    expect(issues).toEqual([]);
  });
}
