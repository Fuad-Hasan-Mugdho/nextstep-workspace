import type { QuizQuestion } from "./data";

export type QuizGrade = { correct: number; total: number; score: number };

// অসম্পূর্ণ বা অজানা option থাকলে score তৈরি হয় না।
export function gradeQuiz(
  questions: QuizQuestion[],
  answers: Record<string, number>,
): QuizGrade | null {
  if (
    questions.length === 0 ||
    questions.some((question) => {
      const answer = answers[question.id];
      return (
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer >= question.options.length
      );
    })
  ) {
    return null;
  }
  const correct = questions.filter(
    (question) => answers[question.id] === question.correctOption,
  ).length;
  return {
    correct,
    total: questions.length,
    score: Math.round((correct / questions.length) * 100),
  };
}
