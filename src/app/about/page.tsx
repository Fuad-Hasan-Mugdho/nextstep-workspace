import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import "@/features/about/about.css";

export const metadata: Metadata = {
  title: "Project tour",
  description:
    "NextStep-এর routing, Server Components, browser state ও Server Actions বাংলায় বুঝুন।",
};

const concepts = [
  {
    number: "01",
    name: "Pages & layouts",
    label: "THE FOUNDATION",
    description:
      "একটি folder, একটি route। page.tsx হলো সেই পাতার content; layout.tsx সব পাতার shared কাঠামো।",
    file: "src/app/layout.tsx",
    tone: "lime",
  },
  {
    number: "02",
    name: "Server + Client",
    label: "THE RIGHT BOUNDARY",
    description:
      "Page server-এ তৈরি হয়। Search, timer ও click-এর মতো interactive অংশে ‘use client’ দরকার।",
    file: "src/features/contact/contact-form.tsx",
    tone: "lavender",
  },
  {
    number: "03",
    name: "State that stays",
    label: "YOUR WORKSPACE",
    description:
      "React UI বদলায়, browser storage অগ্রগতি ধরে রাখে। Refresh করলেও একই browser-এ আপনার কাজ থাকে।",
    file: "src/features/workspace/store.ts",
    tone: "peach",
  },
  {
    number: "04",
    name: "Real Server Actions",
    label: "BEYOND THE BROWSER",
    description:
      "Form জমা হলে server-এ Zod দিয়ে যাচাই হয়। Result ফিরে এসে UI-তে error বা success দেখায়।",
    file: "src/features/contact/actions.ts",
    tone: "blue",
  },
];

export default function AboutPage() {
  return (
    <div className="tour-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">UNDER THE HOOD</p>
          <h1>Built to learn. Made to understand.</h1>
          <p className="page-subtitle">
            শুধু ব্যবহার নয় — প্রতিটি feature কীভাবে কাজ করে, সেটাও শিখুন।
          </p>
        </div>
        <Link className="button button-secondary" href="/courses">
          Explore courses <Icon name="arrow-up-right" size={16} />
        </Link>
      </div>

      <section className="tour-hero panel" aria-labelledby="tour-hero-title">
        <div className="tour-hero-copy">
          <span className="badge">YOUR PROJECT, EXPLAINED</span>
          <h2 id="tour-hero-title">
            ছোট ছোট ধাপে।
            <br />
            <span>পুরো ছবিটা পরিষ্কার।</span>
          </h2>
          <p>
            NextStep একটি learning workspace। Courses, notes, roadmap আর focus
            timer ব্যবহার করতে করতে Next.js-এর বাস্তব code পড়ুন। একবারে সব নয়,
            একটি feature দিয়ে শুরু করুন।
          </p>
          <Link href="/courses" className="button button-primary">
            Start your first lesson <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className="tour-code-window" aria-label="Project folder overview">
          <div className="tour-code-top">
            <span className="tour-code-dots" aria-hidden="true">
              ● ● ●
            </span>
            <span>nextstep / src</span>
            <span>TS</span>
          </div>
          <div className="tour-file-tree">
            <p>
              <span className="tour-tree-directory">app/</span>
              <span>Routes & metadata</span>
            </p>
            <p className="tour-tree-indent">
              layout.tsx <span>Shared shell</span>
            </p>
            <p className="tour-tree-indent">
              page.tsx <span>Dashboard</span>
            </p>
            <p>
              <span className="tour-tree-directory">features/</span>
              <span>One feature at a time</span>
            </p>
            <p className="tour-tree-indent">
              courses/ <span>Learn</span>
            </p>
            <p className="tour-tree-indent">
              workspace/ <span>Remember</span>
            </p>
            <p className="tour-tree-indent">
              contact/ <span>Validate</span>
            </p>
            <p>
              <span className="tour-tree-directory">components/</span>
              <span>Shared building blocks</span>
            </p>
          </div>
          <div className="tour-code-footer">
            <span aria-hidden="true">✓</span> TypeScript · App Router · React
          </div>
        </div>
      </section>

      <section aria-labelledby="tour-concepts-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FOUR IDEAS. ONE CONNECTED APP.</p>
            <h2 id="tour-concepts-heading">যে concept-গুলো দিয়ে সব তৈরি</h2>
          </div>
        </div>
        <div className="tour-concept-grid">
          {concepts.map((concept) => (
            <article
              className={`panel tour-concept tour-concept-${concept.tone}`}
              key={concept.number}
            >
              <div className="tour-concept-top">
                <span className="tour-concept-number">{concept.number}</span>
                <span>{concept.label}</span>
              </div>
              <h3>{concept.name}</h3>
              <p>{concept.description}</p>
              <code>{concept.file}</code>
            </article>
          ))}
        </div>
      </section>

      <div className="tour-detail-grid">
        <section
          className="panel tour-detail"
          aria-labelledby="metadata-heading"
        >
          <span className="badge">THAT LINE IN YOUR EDITOR</span>
          <h2 id="metadata-heading">এই metadata আসলে কী?</h2>
          <p>
            আপনার পরিচিত line-টি browser tab-এর title ঠিক করে। এটি page-এর
            দৃশ্যমান heading নয়; heading লিখতে <code>&lt;h1&gt;</code> লাগে।
          </p>
          <pre className="tour-snippet">
            <code>{`import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project tour",
};`}</code>
          </pre>
          <p>
            <code>Metadata</code> হলো TypeScript type: ভুল property লিখলে editor
            সাহায্য করে। <code>export</code> দিয়ে Next.js-কে object-টি পড়তে
            দেওয়া হয়।
          </p>
          <p>
            Metadata export Server Component-এ রাখুন। Interactive form-টি আলাদা
            Client Component হলে একই page-এ দুটোই ব্যবহার করা যায়।
          </p>
        </section>
        <section
          className="panel tour-detail"
          aria-labelledby="request-heading"
        >
          <span className="badge">FOLLOW THE REQUEST</span>
          <h2 id="request-heading">একটি form-এর পুরো যাত্রা</h2>
          <ol className="tour-flow">
            <li>
              <span>1</span>
              <div>
                <strong>আপনি form পূরণ করেন</strong>
                <p>Browser-এর required ও email checks সাধারণ ভুল ধরে।</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Server Action-এ POST যায়</strong>
                <p>FormData থেকে field পড়ে server আবার Zod দিয়ে যাচাই করে।</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Result ফিরে আসে</strong>
                <p>
                  useActionState result ও pending state UI-তে দেখায়। এই demo
                  কোনো email পাঠায় না।
                </p>
              </div>
            </li>
          </ol>
          <Link href="/contact" className="button button-secondary">
            Try the playground <Icon name="arrow-right" size={16} />
          </Link>
        </section>
      </div>

      <section className="panel tour-next" aria-labelledby="tour-next-heading">
        <div>
          <p className="eyebrow">LEARNING BY DOING</p>
          <h2 id="tour-next-heading">আজ শুধু একটি জিনিস বদলান।</h2>
          <p>
            প্রথমে title বদলান। তারপর একটি lesson যোগ করুন। এরপর form-এর নতুন
            field তৈরি করুন। README ও docs-এ ধাপে ধাপে অনুশীলন আছে।
          </p>
        </div>
        <Link href="/roadmap" className="button button-primary">
          Plan your next step <Icon name="arrow-right" size={16} />
        </Link>
      </section>
    </div>
  );
}
