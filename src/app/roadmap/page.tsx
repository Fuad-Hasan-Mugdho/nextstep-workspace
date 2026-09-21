import type { Metadata } from "next";
import { RoadmapWorkspace } from "@/features/roadmap/roadmap-workspace";

export const metadata: Metadata = {
  title: "Developer Roadmap",
  description:
    "Follow a practical learning path and plan your next small steps.",
};

export default function RoadmapPage() {
  return <RoadmapWorkspace />;
}
