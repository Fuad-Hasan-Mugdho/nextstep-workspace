"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Course } from "@/features/courses/data";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import { LessonQuiz } from "@/features/quizzes/lesson-quiz";
import "@/features/courses/courses.css";

export function CourseReader({ course }: { course: Course }) {
  const { state, completeLesson, enrollCourse, toggleBookmark, hydrated } =
    useWorkspace();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusLesson = useRef(false);

  useEffect(() => {
    if (hydrated) enrollCourse(course.id);
  }, [hydrated, course.id, enrollCourse]);

  // Returning learners start at the first unfinished lesson. Explicit selection
  // remains fixed when completing a lesson changes the shared progress state.
  const activeLesson =
    course.lessons.find((lesson) => lesson.id === selectedLessonId) ??
    course.lessons.find(
      (lesson) => !state.completedLessonIds.includes(lesson.id),
    ) ??
    course.lessons[0];
  const completedCount = course.lessons.filter((lesson) =>
    state.completedLessonIds.includes(lesson.id),
  ).length;
  const progressPercent = course.lessons.length
    ? Math.round((completedCount / course.lessons.length) * 100)
    : 0;
  const isSaved = state.bookmarks.includes(course.id);

  useEffect(() => {
    if (!shouldFocusLesson.current) return;
    shouldFocusLesson.current = false;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [activeLesson?.id]);

  if (!activeLesson) {
    return (
      <div className="empty-state">
        <h1>{course.title}</h1>
        <p>This course has no lessons yet.</p>
        <Link href="/courses" className="button button-secondary">
          Back to courses
        </Link>
      </div>
    );
  }

  const activeLessonIndex = course.lessons.indexOf(activeLesson);
  const isCompleted = state.completedLessonIds.includes(activeLesson.id);
  const allCompleted = completedCount === course.lessons.length;

  function selectLesson(id: string) {
    shouldFocusLesson.current = true;
    setSelectedLessonId(id);
  }

  function handleComplete() {
    setSelectedLessonId(activeLesson.id);
    enrollCourse(course.id);
    completeLesson(activeLesson.id);
  }

  return (
    <div className="course-reader">
      <div className="reader-header">
        <Link href="/courses" className="reader-back">
          <Icon name="chevron-left" size={16} />
          Back to Courses
        </Link>
        <div className="reader-course-meta">
          <span className="course-badge">{course.category}</span>
          <span className="course-level-badge">{course.level}</span>
          <button
            type="button"
            className={`course-bookmark ${isSaved ? "is-saved" : ""}`}
            aria-label={`${isSaved ? "Unsave" : "Save"} ${course.title}`}
            aria-pressed={isSaved}
            onClick={() => toggleBookmark(course.id)}
          >
            <Icon name="bookmark" size={18} />
          </button>
        </div>
      </div>
      <h1 className="reader-course-title">{course.title}</h1>
      <div className="reader-layout">
        <aside
          className="reader-sidebar"
          aria-label="Course progress and lessons"
        >
          <div className="reader-progress-card">
            <h2>Your progress</h2>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Course completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <p>
              {completedCount} of {course.lessons.length} lessons completed (
              {progressPercent}%)
            </p>
          </div>
          <nav className="reader-lesson-list" aria-label="Course lessons">
            {course.lessons.map((lesson, index) => {
              const done = state.completedLessonIds.includes(lesson.id);
              const isActive = lesson.id === activeLesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  className={`reader-lesson-item ${isActive ? "active" : ""} ${done ? "done" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`${index + 1}. ${lesson.title}${done ? ", completed" : ""}`}
                  aria-describedby={`lesson-details-${lesson.id}`}
                  onClick={() => selectLesson(lesson.id)}
                >
                  <span className="lesson-status-icon" aria-hidden="true">
                    {done ? <Icon name="check-circle" size={16} /> : index + 1}
                  </span>
                  <span className="lesson-item-text">
                    <strong>{lesson.title}</strong>
                    <small id={`lesson-details-${lesson.id}`}>
                      {lesson.duration}m
                      {state.quizResults[lesson.id] &&
                        ` · Quiz best: ${state.quizResults[lesson.id].bestScore}%`}
                    </small>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>
        <article className="reader-content" aria-labelledby="lesson-heading">
          <div className="reader-lesson-head">
            <span className="eyebrow">
              LESSON {activeLessonIndex + 1} OF {course.lessons.length} ·{" "}
              {activeLesson.duration} MINS
            </span>
            <h2 id="lesson-heading" ref={headingRef} tabIndex={-1}>
              {activeLesson.title}
            </h2>
            <p className="lesson-intro" lang="bn">
              {activeLesson.intro}
            </p>
          </div>
          <div className="reader-sections">
            {activeLesson.sections.map((section) => (
              <section key={section.title} className="lesson-section">
                <h3>{section.title}</h3>
                <p lang="bn">{section.body}</p>
                {section.code && (
                  <div
                    className="code-block"
                    tabIndex={0}
                    role="region"
                    aria-label={`${section.title} code example`}
                  >
                    <pre>
                      <code>{section.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </div>
          <div className="lesson-challenge">
            <h3>
              <Icon name="sparkles" size={16} /> Challenge / অনুশীলন
            </h3>
            <p lang="bn">{activeLesson.challenge}</p>
          </div>
          <div className="lesson-takeaway">
            <h3>
              <Icon name="check" size={16} /> Key Takeaway
            </h3>
            <p lang="bn">{activeLesson.takeaway}</p>
          </div>
          <LessonQuiz key={activeLesson.id} lessonId={activeLesson.id} />
          <p className="reader-completion-message" role="status">
            {isCompleted
              ? "Lesson completed. Your learning progress is updated."
              : ""}
          </p>
          <div className="reader-actions">
            {activeLessonIndex > 0 && (
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  selectLesson(course.lessons[activeLessonIndex - 1].id)
                }
              >
                <Icon name="chevron-left" size={15} />
                Previous
              </button>
            )}
            <button
              type="button"
              className={`button ${isCompleted ? "button-secondary" : "button-dark"}`}
              onClick={handleComplete}
              disabled={isCompleted || !hydrated}
            >
              <Icon name="check-circle" size={16} />
              {isCompleted ? "Completed" : "Mark as Completed"}
            </button>
            {activeLessonIndex < course.lessons.length - 1 ? (
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  selectLesson(course.lessons[activeLessonIndex + 1].id)
                }
              >
                Next Lesson
                <Icon name="arrow-right" size={15} />
              </button>
            ) : (
              <Link href="/courses" className="button button-secondary">
                Explore courses
                <Icon name="arrow-right" size={15} />
              </Link>
            )}
          </div>
          {allCompleted && (
            <div className="reader-course-finished">
              <Icon name="trophy" size={22} />
              <div>
                <strong>Course complete. Nicely done!</strong>
                <p>
                  You have finished all {course.lessons.length} lessons. Revisit
                  an exercise or explore your next course.
                </p>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
