import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourse, courses } from "@/features/courses/data";
import { CourseReader } from "./course-reader";

type CoursePageProps = { params: Promise<{ slug: string }> };

// The catalog is known at build time; unknown slugs must return a real HTTP 404.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  return { title: course.title, description: course.description };
}

export function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.id,
  }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourse(slug);

  if (!course) {
    notFound();
  }

  return <CourseReader key={course.id} course={course} />;
}
