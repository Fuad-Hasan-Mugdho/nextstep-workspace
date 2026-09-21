import type { Metadata } from "next";
import { FocusWorkspace } from "@/features/focus/focus-workspace";

export const metadata: Metadata = {
  title: "Focus Room",
  description:
    "Make time for learning with a focus timer, short breaks, and your session history.",
};

export default function FocusPage() {
  return <FocusWorkspace />;
}
