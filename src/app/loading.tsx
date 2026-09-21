import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="loading-skeleton">
      <p role="status">Loading your learning space…</p>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </Container>
  );
}
