import type { Metadata } from "next";
import { Suspense } from "react";
import { CourseCatalog } from "@/features/courses/course-catalog";

export const metadata: Metadata = {
  title: "Explore courses",
  description:
    "Learn Next.js, React, and TypeScript with Bengali explanations, code examples, and practical exercises.",
};

export default function CoursesPage() {
  return (
    <div className="courses-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">COURSE CATALOG</div>
          <h1>Explore Learning Paths</h1>
          <p className="page-subtitle">
            Learn Next.js, React, and TypeScript with Bengali explanations and
            practical exercises.
          </p>
        </div>
      </div>
      <Suspense fallback={<p role="status">Loading your course library…</p>}>
        <CourseCatalog />
      </Suspense>
    </div>
  );
}
