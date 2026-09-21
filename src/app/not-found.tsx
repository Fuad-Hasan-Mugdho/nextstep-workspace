import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="statusPage">
      <p className="eyebrow">A SMALL DETOUR</p>
      <h1>404 — পেজটি পাওয়া যায়নি</h1>
      <p lang="bn">ঠিকানাটি ভুল হতে পারে। Dashboard থেকে আবার শুরু করো।</p>
      <Link className="button" href="/">
        হোমে ফিরুন
      </Link>
    </Container>
  );
}
