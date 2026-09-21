import type { Course } from "./data";

// The catalog and the public API deliberately share the same search behavior.
export function filterCourses(
  items: Course[],
  { query = "", category = "All" }: { query?: string; category?: string } = {},
): Course[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  return items.filter((course) => {
    const matchesCategory =
      !normalizedCategory ||
      normalizedCategory === "all" ||
      course.category.toLowerCase() === normalizedCategory;
    const searchableText = `${course.title} ${course.description} ${course.category} ${course.level}`;
    return (
      matchesCategory && searchableText.toLowerCase().includes(normalizedQuery)
    );
  });
}
