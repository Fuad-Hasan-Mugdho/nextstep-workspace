"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { courses } from "@/features/courses/data";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import "./roadmap.css";

const suggestedOrder = [
  "react-essentials",
  "typescript-toolkit",
  "nextjs-fundamentals",
  "fullstack-patterns",
];
const path = [...courses].sort((a, b) => {
  const position = (id: string) => {
    const index = suggestedOrder.indexOf(id);
    return index === -1 ? suggestedOrder.length : index;
  };
  return position(a.id) - position(b.id);
});

function RoadmapPlanner() {
  const { state, addTask, toggleTask, deleteTask } = useWorkspace();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const lessonIds = new Set(
    courses.flatMap((course) => course.lessons.map((lesson) => lesson.id)),
  );
  const completedCount = [...lessonIds].filter((id) =>
    state.completedLessonIds.includes(id),
  ).length;
  const progress = lessonIds.size
    ? Math.round((completedCount / lessonIds.size) * 100)
    : 0;
  const doneTasks = state.tasks.filter((task) => task.done).length;
  const nextCourse = path.find((course) =>
    course.lessons.some(
      (lesson) => !state.completedLessonIds.includes(lesson.id),
    ),
  );

  function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = title.trim();
    if (!value) {
      setMessage("Write a small, specific next step first.");
      return;
    }
    if (value.length > 160) {
      setMessage("Keep your task under 160 characters.");
      return;
    }
    try {
      addTask(value);
      setTitle("");
      setMessage("Your next step is on the list.");
    } catch {
      setMessage(
        "This task could not be added. Your text is still here; try again.",
      );
    }
  }

  return (
    <div className="roadmap-workspace">
      <div className="page-heading">
        <div>
          <div className="eyebrow">A LITTLE DIRECTION GOES A LONG WAY</div>
          <h1>Your developer roadmap</h1>
          <p className="page-subtitle">
            Build your foundations, connect the dots, and bring your ideas to
            life.
          </p>
        </div>
        <Link href="/courses" className="button button-secondary">
          Explore courses <Icon name="arrow-right" size={16} />
        </Link>
      </div>
      <div className="roadmap-overview panel">
        <span className="roadmap-overview-icon">
          <Icon name="route" size={26} />
        </span>
        <div className="roadmap-overview-copy">
          <h2>
            {progress === 100
              ? "Look how far you've come."
              : "Every lesson moves you forward."}
          </h2>
          <p>
            {completedCount} of {lessonIds.size} lessons completed across{" "}
            {courses.length} courses
          </p>
        </div>
        <div className="roadmap-overview-progress">
          <strong>
            {progress}
            <span>% complete</span>
          </strong>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Overall roadmap progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <div className="roadmap-workspace-grid">
        <section aria-labelledby="learning-path-title">
          <div className="roadmap-section-heading">
            <h2 id="learning-path-title">From foundations to full stack</h2>
            <span>{path.length} milestones</span>
          </div>
          <p className="roadmap-path-hint">
            A suggested order, at your own pace. Every course is available from
            the start.
          </p>
          <ol className="learning-path-list">
            {path.map((course, index) => {
              const completed = course.lessons.filter((lesson) =>
                state.completedLessonIds.includes(lesson.id),
              ).length;
              const done =
                course.lessons.length > 0 &&
                completed === course.lessons.length;
              const percent = course.lessons.length
                ? Math.round((completed / course.lessons.length) * 100)
                : 0;
              const isNext = nextCourse?.id === course.id;
              const enrolled = state.enrolledCourseIds.includes(course.id);
              return (
                <li
                  className={`learning-path-step ${done ? "is-done" : ""} ${isNext ? "is-next" : ""}`}
                  key={course.id}
                >
                  <span
                    className="learning-path-marker"
                    aria-label={`Milestone ${index + 1}${done ? ", completed" : ""}`}
                  >
                    {done ? (
                      <Icon name="check" size={19} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <article className="panel learning-path-card">
                    <div className="learning-path-card-top">
                      <span
                        className={`roadmap-category roadmap-category-${course.color}`}
                      >
                        {course.category}
                      </span>
                      <span className="roadmap-level">{course.level}</span>
                      {done ? (
                        <span className="roadmap-done-label">
                          Completed <Icon name="check" size={12} />
                        </span>
                      ) : isNext ? (
                        <span className="roadmap-next-label">
                          Your next milestone
                        </span>
                      ) : null}
                    </div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="learning-path-meta">
                      <span>
                        <Icon name="book" size={14} />
                        {course.lessons.length} lessons
                      </span>
                      <span>
                        <Icon name="clock" size={14} />
                        {course.minutes} min
                      </span>
                    </div>
                    <div className="learning-path-bottom">
                      <div className="learning-path-progress">
                        <span>
                          {completed} / {course.lessons.length} lessons complete
                        </span>
                        <div
                          className="progress-track"
                          role="progressbar"
                          aria-label={`${course.title} progress`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={percent}
                        >
                          <span style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className={`button button-small ${isNext ? "" : "button-secondary"}`}
                      >
                        {done
                          ? "Review course"
                          : completed || enrolled
                            ? "Continue learning"
                            : "Start course"}
                        <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>
        <aside className="roadmap-plan-column">
          <section
            className="panel roadmap-planner"
            aria-labelledby="my-plan-title"
          >
            <div className="roadmap-planner-heading">
              <div>
                <span className="eyebrow">SMALL STEPS, REAL PROGRESS</span>
                <h2 id="my-plan-title">My learning plan</h2>
              </div>
              <Icon name="target" size={21} />
            </div>
            <p className="roadmap-planner-description">
              Turn “I want to learn” into one thing you can do today.
            </p>
            <form onSubmit={createTask} className="roadmap-task-form">
              <label htmlFor="roadmap-task-title">Your next step</label>
              <div>
                <input
                  id="roadmap-task-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  maxLength={160}
                  placeholder="e.g. Build a reusable card"
                />
                <button className="button" type="submit" aria-label="Add task">
                  <Icon name="plus" size={18} />
                </button>
              </div>
            </form>
            <p className="roadmap-task-feedback" role="status">
              {message}
            </p>
            {state.tasks.length > 0 ? (
              <>
                <div className="roadmap-task-counter">
                  <span>
                    {doneTasks} of {state.tasks.length} done
                  </span>
                  <span>
                    {Math.round((doneTasks / state.tasks.length) * 100)}%
                  </span>
                </div>
                <ul className="roadmap-task-list">
                  {state.tasks.map((task) => (
                    <li key={task.id} className={task.done ? "is-done" : ""}>
                      <div className="roadmap-task-row">
                        <label>
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(task.id)}
                          />
                          <span>{task.title}</span>
                        </label>
                        <button
                          className="button button-ghost roadmap-task-delete"
                          aria-label={`Delete task: ${task.title}`}
                          onClick={() => setPendingDelete(task.id)}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                      {pendingDelete === task.id && (
                        <div className="roadmap-task-confirm" role="alert">
                          <p>Remove this task from your plan?</p>
                          <button
                            className="button button-small button-danger"
                            onClick={() => {
                              deleteTask(task.id);
                              setPendingDelete(null);
                              setMessage("Task removed from your plan.");
                            }}
                          >
                            Remove task
                          </button>
                          <button
                            className="button button-small button-ghost"
                            onClick={() => setPendingDelete(null)}
                          >
                            Keep task
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="roadmap-plan-empty">
                <span>
                  <Icon name="notes" size={25} />
                </span>
                <h3>A fresh plan starts here</h3>
                <p>
                  Add a lesson to practice, a project to build, or a question to
                  explore.
                </p>
              </div>
            )}
          </section>
          <div className="roadmap-planner-tip">
            <span>
              <Icon name="sparkles" size={20} />
            </span>
            <div>
              <h3>Make it small enough to start.</h3>
              <p>
                “Build one button” is easier to act on than “master React.”
                Small, finished steps add up.
              </p>
              <Link href="/focus">
                Give your next step 25 minutes{" "}
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function RoadmapWorkspace() {
  const { hydrated } = useWorkspace();
  return hydrated ? (
    <RoadmapPlanner />
  ) : (
    <div className="panel empty-state" role="status">
      Finding your next steps…
    </div>
  );
}
