import { courses } from "@/features/courses/data";
import { filterCourses } from "@/features/courses/filter-courses";

// Public, read-only course summaries. Learning progress stays in browser storage.
export function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const matches = filterCourses(courses, {
    query: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "All",
  });
  const summaries = matches.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    minutes: course.minutes,
    lessonCount: course.lessons.length,
  }));

  return Response.json({ courses: summaries, total: summaries.length });
}
