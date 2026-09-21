"use client";

import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import { courses } from "./data";
import { CourseCard } from "./course-card";
import { filterCourses } from "./filter-courses";
import "./courses.css";

const categories = ["All", "Next.js", "React", "TypeScript"];

export function CourseCatalog() {
  const searchParams = useSearchParams();
  const { state, hydrated } = useWorkspace();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "All";
  const bookmarksOnly = searchParams.get("saved") === "1";

  // Native history keeps filters shareable without a server fetch.
  // Next.js synchronizes useSearchParams with pushState and replaceState.
  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    const suffix = params.toString();
    window.history.replaceState(
      null,
      "",
      suffix ? `/courses?${suffix}` : "/courses",
    );
  }

  const results = filterCourses(courses, { query, category }).filter(
    (course) => !bookmarksOnly || state.bookmarks.includes(course.id),
  );

  return (
    <>
      <div className="courses-toolbar">
        <div
          className="category-chips"
          role="group"
          aria-label="Filter courses by category"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${category === item ? "active" : ""}`}
              aria-pressed={category === item}
              onClick={() =>
                updateFilter("category", item === "All" ? "" : item)
              }
            >
              {item}
            </button>
          ))}
        </div>
        <div className="courses-search-wrapper">
          <Icon name="search" size={16} />
          <input
            type="search"
            aria-label="Search courses"
            placeholder="Search courses..."
            value={query}
            onChange={(event) => updateFilter("q", event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="clear-button"
              onClick={() => updateFilter("q", "")}
              aria-label="Clear search"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="catalog-results-bar">
        <p className="muted" role="status">
          {bookmarksOnly && !hydrated
            ? "Loading saved courses…"
            : `${results.length} ${results.length === 1 ? "course" : "courses"} to explore`}
        </p>
        <button
          type="button"
          className={`chip catalog-saved-filter ${bookmarksOnly ? "active" : ""}`}
          aria-pressed={bookmarksOnly}
          onClick={() => updateFilter("saved", bookmarksOnly ? "" : "1")}
        >
          <Icon name="bookmark" size={15} /> Saved courses
        </button>
      </div>
      {bookmarksOnly && !hydrated ? null : results.length > 0 ? (
        <div className="courses-grid">
          {results.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name={bookmarksOnly ? "bookmark" : "book"} size={36} />
          <h2>
            {bookmarksOnly ? "No saved courses match" : "No courses found"}
          </h2>
          <p>
            {bookmarksOnly
              ? "Save a course with its bookmark button, or reset your filters to explore the library."
              : "Try a different search or reset your filters."}
          </p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => window.history.replaceState(null, "", "/courses")}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
