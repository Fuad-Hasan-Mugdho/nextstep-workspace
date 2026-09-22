"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import { quizByLessonId } from "./data";
import { gradeQuiz, type QuizGrade } from "./grade";
import "./quizzes.css";

export function LessonQuiz({ lessonId }: { lessonId: string }) {
  const { state, hydrated, storageError, recordQuizResult } = useWorkspace();
  const questions = quizByLessonId[lessonId] ?? [];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [grade, setGrade] = useState<QuizGrade | null>(null);
  const submissionLocked = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const history = state.quizResults[lessonId];
  const answeredCount = questions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const headingId = `quiz-${lessonId}`;

  useEffect(() => {
    if (grade) resultRef.current?.focus();
  }, [grade]);

  useEffect(() => {
    function clearAttempt() {
      submissionLocked.current = false;
      setAnswers({});
      setGrade(null);
    }
    window.addEventListener("nextstep:reset", clearAttempt);
    return () => window.removeEventListener("nextstep:reset", clearAttempt);
  }, []);

  if (questions.length === 0) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated || submissionLocked.current) return;
    const result = gradeQuiz(questions, answers);
    if (!result) return;
    // Event handler-এ save হয়; repeated submit একই attempt আবার count করে না।
    submissionLocked.current = true;
    recordQuizResult(lessonId, result.score);
    setGrade(result);
  }

  function retry() {
    submissionLocked.current = false;
    setAnswers({});
    setGrade(null);
    headingRef.current?.focus();
  }

  return (
    <section className="lesson-quiz" aria-labelledby={headingId}>
      <div className="quiz-heading">
        <span className="quiz-icon">
          <Icon name="target" size={22} />
        </span>
        <div>
          <p className="eyebrow">CHECK YOUR UNDERSTANDING</p>
          <h3 id={headingId} ref={headingRef} tabIndex={-1}>
            Lesson quiz
          </h3>
        </div>
      </div>
      <p className="quiz-intro" lang="bn">
        সব প্রশ্নের উত্তর দিয়ে submit করুন। তারপর সঠিক উত্তর ও ব্যাখ্যা পড়ে
        আবার চেষ্টা করতে পারবেন।
      </p>
      {history && (
        <div
          className="quiz-history"
          role="group"
          aria-label="Saved quiz scores"
        >
          <span>
            <Icon name="trophy" size={15} /> Best: {history.bestScore}%
          </span>
          <span>Last: {history.score}%</span>
          <span>Attempts: {history.attempts}</span>
        </div>
      )}
      <form onSubmit={submit}>
        <div className="quiz-questions">
          {questions.map((question, questionIndex) => {
            const correct = answers[question.id] === question.correctOption;
            const feedbackId = `${headingId}-${question.id}-feedback`;
            return (
              <fieldset
                key={question.id}
                className="quiz-question"
                disabled={!hydrated || grade !== null}
                aria-describedby={grade ? feedbackId : undefined}
              >
                <legend lang="bn">
                  {questionIndex + 1}. {question.prompt}
                </legend>
                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[question.id] === optionIndex;
                    const isCorrectAnswer =
                      grade !== null && optionIndex === question.correctOption;
                    const isWrongAnswer =
                      grade !== null && selected && !correct;
                    return (
                      <label
                        key={optionIndex}
                        className={`quiz-option${selected ? " is-selected" : ""}${isCorrectAnswer ? " is-correct" : ""}${isWrongAnswer ? " is-incorrect" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`${headingId}-${question.id}`}
                          value={optionIndex}
                          checked={selected}
                          required
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: optionIndex,
                            }))
                          }
                        />
                        <span lang="bn">{option}</span>
                        {isCorrectAnswer && (
                          <Icon name="check-circle" size={17} />
                        )}
                        {isWrongAnswer && <Icon name="x" size={17} />}
                      </label>
                    );
                  })}
                </div>
                {grade && (
                  <div
                    id={feedbackId}
                    className={`quiz-feedback ${correct ? "is-correct" : "is-incorrect"}`}
                  >
                    <strong>{correct ? "Correct" : "Incorrect"}</strong>
                    <p>
                      <strong>Correct answer: </strong>
                      <span lang="bn">
                        {question.options[question.correctOption]}
                      </span>
                    </p>
                    <p lang="bn">{question.explanation}</p>
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>
        {grade ? (
          <>
            <div
              className="quiz-result"
              ref={resultRef}
              tabIndex={-1}
              role="status"
            >
              <Icon
                name={grade.score === 100 ? "trophy" : "target"}
                size={24}
              />
              <div>
                <strong>
                  Score: {grade.correct} / {grade.total} ({grade.score}%)
                </strong>
                <p>
                  {grade.score === 100
                    ? "All correct. Ready for your next lesson!"
                    : "Review the explanations and try again at your own pace."}
                </p>
              </div>
            </div>
            {storageError && (
              <p className="quiz-storage-warning" role="alert">
                This result is available for this visit, but could not be saved.
                Export a backup in Settings.
              </p>
            )}
            <button
              type="button"
              className="button button-secondary"
              onClick={retry}
            >
              <Icon name="reset" size={16} /> Try again
            </button>
          </>
        ) : (
          <div className="quiz-actions">
            <p>
              {answeredCount} of {questions.length} answered
            </p>
            <button
              type="submit"
              className="button"
              disabled={!hydrated || answeredCount !== questions.length}
            >
              Submit answers <Icon name="arrow-right" size={16} />
            </button>
          </div>
        )}
      </form>
      <p className="quiz-note">
        Practice at your own pace. Lesson completion is separate; unfinished
        answers clear when you leave this lesson.
      </p>
    </section>
  );
}
