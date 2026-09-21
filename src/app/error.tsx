"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);

  return (
    <div className="container statusPage">
      <h1>কিছু একটা সমস্যা হয়েছে</h1>
      <p>আবার চেষ্টা করুন। সমস্যা থাকলে server log দেখুন।</p>
      <button className="button" onClick={reset} type="button">
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}
