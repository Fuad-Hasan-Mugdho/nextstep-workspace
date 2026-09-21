"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { courses } from "@/features/courses/data";
import { CourseCard } from "@/features/courses/course-card";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import { localDateKey, startOfWeek } from "@/features/workspace/model";

function StatCard({
  icon,
  value,
  label,
  detail,
  color,
}: {
  icon: IconName;
  value: string | number;
  label: string;
  detail: string;
  color: string;
}) {
  return (
    <div className="stat-card">
      <span className={`stat-icon ${color}`}>
        <Icon name={icon} size={20} />
      </span>
      <div className="stat-main">
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span className="stat-detail">{detail}</span>
    </div>
  );
}

export function Dashboard() {
  const { state, hydrated } = useWorkspace();
  const now = hydrated ? new Date() : new Date("2026-01-05T12:00:00Z");
  const validLessonIds = new Set(
    courses.flatMap((course) => course.lessons.map((lesson) => lesson.id)),
  );
  const completedLessonIds = [...new Set(state.completedLessonIds)].filter(
    (id) => validLessonIds.has(id),
  );
  const completions = Object.entries(state.lessonCompletedAt)
    .filter(([id]) => completedLessonIds.includes(id))
    .map(([, date]) => date);
  const startedCount = courses.filter((course) =>
    state.enrolledCourseIds.includes(course.id),
  ).length;
  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekLessons = completions.filter(
    (at) => new Date(at) >= weekStart && new Date(at) < weekEnd,
  ).length;
  const goalPercent = Math.min(
    100,
    Math.round((weekLessons / state.profile.weeklyGoal) * 100),
  );
  const focusMinutes = state.sessions.reduce(
    (sum, session) => sum + session.minutes,
    0,
  );
  const activeCourse =
    courses.find(
      (course) =>
        state.enrolledCourseIds.includes(course.id) &&
        course.lessons.some(
          (lesson) => !state.completedLessonIds.includes(lesson.id),
        ),
    ) ??
    courses.find((course) =>
      course.lessons.some(
        (lesson) => !state.completedLessonIds.includes(lesson.id),
      ),
    ) ??
    courses[0];
  const completedInCourse = activeCourse.lessons.filter((lesson) =>
    state.completedLessonIds.includes(lesson.id),
  ).length;
  const nextLesson =
    activeCourse.lessons.find(
      (lesson) => !state.completedLessonIds.includes(lesson.id),
    ) ?? activeCourse.lessons[0];
  const completedCourses = courses.filter((course) =>
    course.lessons.every((lesson) =>
      state.completedLessonIds.includes(lesson.id),
    ),
  ).length;
  const learningDays = new Set(
    [...completions, ...state.sessions.map((session) => session.date)].map(
      (at) => localDateKey(new Date(at)),
    ),
  );
  let streak = 0;
  const streakDate = new Date(now);
  if (!learningDays.has(localDateKey(streakDate)))
    streakDate.setDate(streakDate.getDate() - 1);
  while (learningDays.has(localDateKey(streakDate))) {
    streak++;
    streakDate.setDate(streakDate.getDate() - 1);
  }
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return {
      date,
      count: completions.filter(
        (at) => localDateKey(new Date(at)) === localDateKey(date),
      ).length,
    };
  });
  const maxCount = Math.max(4, ...days.map((day) => day.count));
  const recommended = courses
    .filter((course) => course.id !== activeCourse.id)
    .slice(0, 2);

  return (
    <div className="dashboard-page">
      <div className="page-heading dashboard-heading">
        <div>
          <div className="eyebrow greeting-eyebrow">
            <span />
            YOUR PERSONAL LEARNING SPACE
          </div>
          <h1>
            A good day to grow, {state.profile.name.split(" ")[0]}{" "}
            <span className="greeting-sun">
              <Icon name="sun" size={30} />
            </span>
          </h1>
          <p className="page-subtitle">
            A little curiosity. A little practice. One step closer to your
            goals.
          </p>
        </div>
        <Link href="/roadmap" className="button button-secondary">
          <Icon name="calendar" size={17} />
          My learning plan
        </Link>
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-primary">
          <section className="welcome-banner">
            <div className="welcome-copy">
              <span className="banner-eyebrow">
                <span className="live-dot" /> YOUR NEXT CHAPTER STARTS HERE
              </span>
              <h2>
                Learn it. Build it.
                <br />
                <span>Make it yours.</span>
              </h2>
              <p>
                Turn “I want to learn” into “I made this.”
                <br />
                Your developer journey, one lesson at a time.
              </p>
              <Link
                href={`/courses/${activeCourse.id}`}
                className="button button-dark"
              >
                {completedInCourse ? "Keep learning" : "Let’s start learning"}
                <Icon name="arrow-right" size={17} />
              </Link>
              <span className="banner-footnote">
                <Icon name="check-circle" size={13} /> Free lessons. Real
                progress. Your pace.
              </span>
            </div>
            <div className="hero-illustration" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <span className="floating-symbol symbol-brackets">&lt;/&gt;</span>
              <span className="floating-symbol symbol-spark">✧</span>
              <div className="code-window">
                <div className="code-window-bar">
                  <i />
                  <i />
                  <i />
                  <span>your-next-step.tsx</span>
                </div>
                <div className="code-window-content">
                  <p>
                    <em>const</em> developer = &#123;
                  </p>
                  <p className="code-indent">
                    name:{" "}
                    <span>&apos;{state.profile.name.split(" ")[0]}&apos;</span>,
                  </p>
                  <p className="code-indent">
                    curiosity: <span>&apos;unlimited&apos;</span>,
                  </p>
                  <p className="code-indent">
                    progress: <b>oneStepAtATime</b>
                  </p>
                  <p>&#125;;</p>
                  <p className="code-comment">
                    {"// great things start small"}
                  </p>
                  <p>
                    <em>await</em> developer.<b>grow</b>();
                    <i className="code-cursor" />
                  </p>
                </div>
              </div>
              <div className="floating-success">
                <span>
                  <Icon name="check" size={15} />
                </span>
                Future you says thanks.
              </div>
              <div className="hero-dot-grid" />
            </div>
          </section>
          <section className="stats-grid" aria-label="Your learning statistics">
            <StatCard
              icon="book"
              value={startedCount}
              label="Courses started"
              detail={`${courses.length} paths to explore`}
              color="purple"
            />
            <StatCard
              icon="check-circle"
              value={completedLessonIds.length}
              label="Lessons completed"
              detail={`${completedCourses} courses finished`}
              color="green"
            />
            <StatCard
              icon="clock"
              value={
                focusMinutes >= 60
                  ? `${(focusMinutes / 60).toFixed(1)}h`
                  : `${focusMinutes}m`
              }
              label="Focused learning"
              detail="Time invested in you"
              color="amber"
            />
          </section>
          <section className="continue-section">
            <div className="section-heading">
              <h2>
                {state.enrolledCourseIds.length
                  ? "Pick up where you left off"
                  : "Your first step starts here"}
              </h2>
              <Link href="/courses">
                View all courses <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="continue-card">
              <div className="nextjs-art" aria-hidden="true">
                <span>
                  {activeCourse.category === "React"
                    ? "⚛"
                    : activeCourse.category === "TypeScript"
                      ? "TS"
                      : "N↗"}
                </span>
                <small>{activeCourse.category.toUpperCase()}</small>
                <i />
              </div>
              <div className="continue-content">
                <span className="course-category-label">
                  {activeCourse.category.toUpperCase()} <span>•</span>{" "}
                  {activeCourse.level}
                </span>
                <h3>{activeCourse.title}</h3>
                <p>Up next: {nextLesson.title}</p>
                <div className="continue-progress">
                  <div className="progress-track">
                    <span
                      style={{
                        width: `${(completedInCourse / activeCourse.lessons.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span>
                    {completedInCourse}/{activeCourse.lessons.length} lessons
                  </span>
                </div>
              </div>
              <Link
                className="round-play"
                href={`/courses/${activeCourse.id}`}
                aria-label={`Continue ${activeCourse.title}`}
              >
                <Icon name="play" size={18} />
              </Link>
            </div>
          </section>
          <section className="recommended-section">
            <div className="section-heading">
              <div>
                <h2>A little more to explore</h2>
                <p>Build a strong foundation, one skill at a time.</p>
              </div>
              <Link href="/courses">
                Explore library <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="dashboard-course-grid">
              {recommended.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
          <section className="project-callout">
            <span className="project-callout-icon">
              <Icon name="code" size={25} />
            </span>
            <div>
              <h3>Curious how this whole thing works?</h3>
              <p lang="bn">
                এই project-এর প্রতিটি অংশ বাংলায় বুঝে নাও। দেখে শেখো, নিজে
                বানাও।
              </p>
            </div>
            <Link href="/about" className="button button-secondary">
              Take a project tour <Icon name="arrow-up-right" size={16} />
            </Link>
          </section>
        </div>
        <aside
          className="dashboard-secondary"
          aria-label="Goals and learning activity"
        >
          <section className="panel weekly-goal">
            <div className="section-heading">
              <h2>This week’s goal</h2>
              <Link
                href="/settings"
                className="icon-button"
                aria-label="Edit weekly goal"
              >
                <Icon name="edit" size={16} />
              </Link>
            </div>
            <div
              className="goal-ring"
              style={{
                background: `conic-gradient(var(--primary) ${goalPercent}%, #eeedf5 0)`,
              }}
              role="img"
              aria-label={`${weekLessons} of ${state.profile.weeklyGoal} lessons completed this week`}
            >
              <div>
                <span className="goal-ring-icon">
                  <Icon name="target" size={22} />
                </span>
                <strong>
                  {weekLessons}
                  <span> / {state.profile.weeklyGoal}</span>
                </strong>
                <small>lessons completed</small>
              </div>
            </div>
            <h3>
              {goalPercent === 100 ? "You made it happen!" : "You’ve got this!"}{" "}
              <span>✦</span>
            </h3>
            <p>
              {goalPercent === 100
                ? "Your weekly goal is complete. Every extra step is a bonus."
                : "Make a little time for something your future self will thank you for."}
            </p>
            <div className="week-dots">
              {days.map(({ date }) => (
                <div key={date.toISOString()}>
                  <span>
                    {date.toLocaleDateString("en", { weekday: "narrow" })}
                  </span>
                  <i
                    className={`${learningDays.has(localDateKey(date)) ? "day-done" : ""} ${hydrated && localDateKey(date) === localDateKey(now) ? "day-today" : ""}`}
                  >
                    {learningDays.has(localDateKey(date)) ? (
                      <Icon name="check" size={12} />
                    ) : (
                      ""
                    )}
                  </i>
                </div>
              ))}
            </div>
            <div className="streak-line">
              <Icon name="flame" size={18} />
              <strong>{streak} day streak</strong>
              <span>Keep showing up</span>
            </div>
          </section>
          <section className="panel activity-panel">
            <div className="section-heading">
              <h2>Learning activity</h2>
              <span className="chart-label">This week</span>
            </div>
            <div className="activity-summary">
              <strong>{weekLessons}</strong>
              <span>lessons completed</span>
            </div>
            <div
              className="activity-chart"
              role="img"
              aria-label={`Lessons completed this week: ${days.map(({ date, count }) => `${date.toLocaleDateString("en", { weekday: "long" })} ${count}`).join(", ")}`}
            >
              <div className="chart-grid">
                <i />
                <i />
                <i />
              </div>
              {days.map(({ date, count }) => (
                <div className="chart-column" key={date.toISOString()}>
                  <div
                    className={`chart-bar ${hydrated && localDateKey(date) === localDateKey(now) ? "is-today" : ""}`}
                    style={{
                      height: `${Math.max(3, (count / maxCount) * 86)}px`,
                    }}
                    title={`${count} lessons`}
                  />
                  <span>
                    {date
                      .toLocaleDateString("en", { weekday: "short" })
                      .slice(0, 1)}
                  </span>
                </div>
              ))}
            </div>
            <p className="chart-caption">
              <span /> Every lesson is a step forward.
            </p>
          </section>
          <section className="daily-note">
            <span className="daily-note-label">
              <Icon name="sparkles" size={16} /> A NOTE TO YOURSELF
            </span>
            <blockquote>
              “You don’t need to be an expert to begin. You need to begin to
              become one.”
            </blockquote>
            <div>
              <span className="note-line" />
              <span>Progress over perfection</span>
            </div>
          </section>
          <Link href="/focus" className="focus-mini">
            <span className="focus-mini-icon">
              <Icon name="coffee" size={24} />
            </span>
            <div>
              <h3>A moment to focus</h3>
              <p>25 minutes. One small win.</p>
            </div>
            <Icon name="arrow-right" size={17} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
