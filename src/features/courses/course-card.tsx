"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Course } from "./data";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import "./courses.css";

export type CourseCardProps = { course: Course };

export function CourseCard({ course }: CourseCardProps) {
  const { state, toggleBookmark } = useWorkspace();
  const completedCount = course.lessons.filter((lesson) =>
    state.completedLessonIds.includes(lesson.id),
  ).length;
  const isEnrolled = state.enrolledCourseIds.includes(course.id);
  const isSaved = state.bookmarks.includes(course.id);
  const totalLessons = course.lessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const action =
    totalLessons > 0 && completedCount === totalLessons
      ? "Review"
      : completedCount > 0 || isEnrolled
        ? "Continue"
        : "Start";

  return (
    <article className={`course-card course-card-${course.color}`}>
      <div className="course-card-header">
        <span className="course-badge">{course.category}</span>
        <div className="course-card-controls">
          <span className="course-level-badge">{course.level}</span>
          <button
            type="button"
            className={`course-bookmark ${isSaved ? "is-saved" : ""}`}
            aria-label={`${isSaved ? "Unsave" : "Save"} ${course.title}`}
            aria-pressed={isSaved}
            onClick={() => toggleBookmark(course.id)}
          >
            <Icon name="bookmark" size={17} />
          </button>
        </div>
      </div>
      <div className="course-card-body">
        <h3 className="course-card-title">
          <Link href={`/courses/${course.id}`}>{course.title}</Link>
        </h3>
        <p className="course-card-desc">{course.description}</p>
      </div>
      <div className="course-card-footer">
        <div className="course-meta">
          <span className="course-meta-item">
            <Icon name="book" size={15} />
            {totalLessons} lessons
          </span>
          <span className="course-meta-item">
            <Icon name="clock" size={15} />
            {course.minutes}m
          </span>
        </div>
        <Link
          href={`/courses/${course.id}`}
          className="button button-small course-card-action"
          aria-label={`${action} ${course.title}`}
        >
          {action}
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>
      {(isEnrolled || completedCount > 0) && (
        <div className="course-card-progress">
          <div
            className="progress-bar-bg"
            role="progressbar"
            aria-label={`${course.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="progress-text">
            {completedCount}/{totalLessons} lessons completed ·{" "}
            {progressPercent}%
          </span>
        </div>
      )}
    </article>
  );
}

export default CourseCard;
