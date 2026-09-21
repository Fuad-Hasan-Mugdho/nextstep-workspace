export type Lesson = {
  id: string;
  title: string;
  duration: number;
  intro: string;
  sections: { title: string; body: string; code?: string }[];
  challenge: string;
  takeaway: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: "Next.js" | "React" | "TypeScript";
  level: "Beginner" | "Intermediate";
  minutes: number;
  color: "purple" | "blue" | "amber" | "green";
  lessons: Lesson[];
};

// One readable source of truth powers the catalog, reader, dashboard and API.
// Lesson IDs stay unique across courses so progress can be stored by ID.
export const courses: Course[] = [
  {
    id: "nextjs-fundamentals",
    title: "Next.js Fundamentals",
    description:
      "Your first step from React components to a complete web application.",
    category: "Next.js",
    level: "Beginner",
    minutes: 45,
    color: "purple",
    lessons: [
      {
        id: "nextjs-routing",
        title: "Meet the App Router",
        duration: 10,
        intro:
          "Next.js হলো React-এর একটি framework। React দিয়ে UI তৈরি হয়; Next.js সেই UI-এর routing, server rendering এবং production build-এর ব্যবস্থা করে। এই অ্যাপের folder structure দিয়েই শুরু করি।",
        sections: [
          {
            title: "A folder becomes a route",
            body: "src/app-এর ভেতরে একটি folder URL-এর একটি অংশ। কিন্তু শুধু folder বানালেই page প্রকাশ হয় না—তার ভেতরে page.tsx লাগবে। src/app/courses/page.tsx হলো /courses। এই নিয়ম জানলে আলাদা route configuration লিখতে হয় না।",
            code: "src/app/\n├── layout.tsx         → shared application shell\n├── page.tsx           → /\n└── courses/\n    ├── page.tsx       → /courses\n    └── [slug]/\n        └── page.tsx   → /courses/nextjs-fundamentals",
          },
          {
            title: "Pages and layouts have different jobs",
            body: "page.tsx একটি route-এর নিজস্ব content দেখায়। layout.tsx তার children-এর চারপাশে shared UI রাখে। এই project-এর sidebar ও header একই layout-এ থাকে। Root layout-এ html ও body থাকতে হয়। navigation-এ shared layout তার state ধরে রাখতে পারে।",
            code: 'export default function Layout({\n  children,\n}: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}',
          },
          {
            title: "Navigate with Link",
            body: "অ্যাপের ভেতরে route বদলাতে next/link ব্যবহার করো। এটি client-side navigation দেয় এবং উপযুক্ত অবস্থায় route prefetch করে। Browser-এর back button, open in new tab এবং keyboard navigation-ও কাজ করে।",
            code: 'import Link from "next/link";\n\n<Link href="/courses">Explore courses</Link>',
          },
        ],
        challenge:
          "src/app/hello/page.tsx বানাও। একটি heading লিখে dashboard থেকে Link দিয়ে /hello-তে যাও। তারপর সরাসরি URL লিখেও page খোলে কি না দেখো।",
        takeaway:
          "Folder URL নির্ধারণ করে, page content দেখায়, layout shared UI ধরে রাখে।",
      },
      {
        id: "nextjs-server-client",
        title: "Server & Client Components",
        duration: 12,
        intro:
          "একটি Next.js page-এ সব code browser-এ চলে না। কোন অংশ server-এ থাকবে আর কোন অংশ interactive হবে—এই boundary বুঝলে data access, performance এবং state অনেক পরিষ্কার হবে।",
        sections: [
          {
            title: "Start on the server",
            body: "App Router-এর page ও layout default-ভাবে Server Component। এগুলো server-এ data পড়ে UI তৈরি করতে পারে। Database credentials বা API secrets এখানে রাখা যায়, তবে সেই secret কখনো client props-এ পাঠানো যাবে না। এই project-এ course page server-এ course খুঁজে reader-কে serializable data দেয়।",
            code: 'import { getCourse } from "@/features/courses/data";\n\nexport default function Page() {\n  const course = getCourse("nextjs-fundamentals");\n  return <h1>{course?.title}</h1>;\n}',
          },
          {
            title: "Add a client boundary for interaction",
            body: "useState, onClick বা browser API দরকার হলে file-এর শুরুতে 'use client' লিখতে হয়। এর imports-ও client module graph-এর অংশ হয়। পুরো page client করার বদলে interactive অংশ আলাদা component রাখো। Client Component প্রথম load-এ server থেকে HTML পেতে পারে; hydration-এর পর button কাজ করে।",
            code: '"use client";\n\nimport { useState } from "react";\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount((n) => n + 1)}>\n      Completed: {count}\n    </button>\n  );\n}',
          },
          {
            title: "Keep browser storage out of render",
            body: "localStorage শুধু browser-এ পাওয়া যায়। render-এর সময় সেটি পড়লে server-এ error বা hydration mismatch হতে পারে। এই অ্যাপের workspace store hydration-এর সময় browser storage থেকে state পড়ে এবং useSyncExternalStore দিয়ে UI-তে পৌঁছায়। localStorage account বা database নয়: data এই browser-এই থাকে।",
          },
        ],
        challenge:
          "একটি Server Component page-এর ভেতরে উপরের Counter বসাও। শুধু Counter file-এ 'use client' রাখো। React DevTools-এ count বদলানোর সময় অন্য অংশ অক্ষত থাকে কি না দেখো।",
        takeaway:
          "Data ও secrets server-এ রাখো; state ও event handler-এর জন্য ছোট client boundary ব্যবহার করো।",
      },
      {
        id: "nextjs-dynamic-routes",
        title: "Dynamic Routes & Metadata",
        duration: 11,
        intro:
          "চারটি course-এর জন্য চারটি page file দরকার নেই। একটি [slug] route URL থেকে identifier নিয়ে সঠিক content দেখাতে পারে। সঙ্গে unknown URL এবং browser tab-এর title-ও সামলাতে হবে।",
        sections: [
          {
            title: "Await your route parameters",
            body: "বর্তমান Next.js-এ page-এর params একটি Promise। তাই async page-এ await করে slug নিতে হয়। Next.js 14-এর synchronous params example এখানে অনুসরণ করো না। [slug] folder-এর নামই object-এর key।",
            code: 'import { notFound } from "next/navigation";\nimport { getCourse } from "@/features/courses/data";\n\nexport default async function Page({ params }: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const course = getCourse(slug);\n  if (!course) notFound();\n  return <h1>{course.title}</h1>;\n}',
          },
          {
            title: "A useful title for every page",
            body: "Static page-এর জন্য metadata export করো। Data অনুযায়ী title বদলাতে generateMetadata ব্যবহার করো। Metadata API Server Component-এ ব্যবহার হয়; interactive reader-কে তাই আলাদা client file-এ রাখা হয়েছে।",
            code: 'import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: "Explore courses",\n  description: "Learn Next.js, one small step at a time.",\n};',
          },
          {
            title: "Handle unknown routes deliberately",
            body: "URL user পরিবর্তন করতে পারে। course খুঁজে না পেলে empty reader দেখানোর বদলে notFound() call করো। এটি route rendering থামিয়ে nearest not-found.tsx দেখায়। বিদ্যমান course-এর জন্য generateStaticParams build-এর সময় slug list দিতে পারে।",
          },
        ],
        challenge:
          "এই course URL-এর slug বদলে /courses/does-not-exist খুলে দেখো। তারপর data.ts-এ নতুন course যোগ করে একই dynamic page সেটিকে দেখায় কি না পরীক্ষা করো।",
        takeaway:
          "একটি dynamic page অনেক resource দেখায়; Promise params, metadata এবং missing data তিনটিই সামলাও।",
      },
      {
        id: "nextjs-data-api",
        title: "Data Fetching & Route Handlers",
        duration: 12,
        intro:
          "UI-এর data সবসময় external API থেকে আসতে হবে না। এই project-এ typed local data দিয়ে শেখা শুরু হয়েছে। একই data browser page এবং একটি read-only JSON endpoint-এ ব্যবহার হচ্ছে।",
        sections: [
          {
            title: "Read data close to where it lives",
            body: "Server Component থেকে নিজের /api endpoint-এ HTTP request করার দরকার নেই। Shared data function সরাসরি import করলে অপ্রয়োজনীয় network hop এড়ানো যায়। External service থেকে fetch করলে response.ok পরীক্ষা করো এবং error UI রাখো। fetch response default-ভাবে cached নয়; cache policy সচেতনভাবে ঠিক করতে হয়।",
            code: 'const response = await fetch("https://example.com/api/courses", {\n  cache: "no-store",\n});\n\nif (!response.ok) {\n  throw new Error("Could not load courses");\n}\nconst courses = await response.json();',
          },
          {
            title: "Expose JSON with a Route Handler",
            body: "app/api/courses/route.ts-এ exported GET function HTTP request সামলায়। এটি page component নয় এবং layout-এর মধ্যে render হয় না। URLSearchParams দিয়ে query পড়া যায়। এই অ্যাপের /api/courses?q=react খুলে actual response দেখো।",
            code: 'import { courses } from "@/features/courses/data";\n\nexport function GET(request: Request) {\n  const query = new URL(request.url)\n    .searchParams.get("q")?.toLowerCase() ?? "";\n  const results = courses.filter((course) =>\n    course.title.toLowerCase().includes(query)\n  );\n  return Response.json({ courses: results });\n}',
          },
          {
            title: "Loading and errors are part of the feature",
            body: "loading.tsx navigation-এর সময় fallback দেখাতে পারে। error.tsx একটি Client Component boundary, যার reset callback আবার render করার চেষ্টা করে। Empty result, missing record এবং unexpected failure একই ঘটনা নয়—প্রতিটির জন্য বোঝা যায় এমন UI রাখো।",
          },
        ],
        challenge:
          "/api/courses এবং /api/courses?q=react browser-এ খোলো। DevTools Network tab-এ status ও JSON body দেখো। তারপর এমন query দাও যা কোনো course-এর সঙ্গে মেলে না।",
        takeaway:
          "Server-এ shared data সরাসরি পড়ো; HTTP consumer-এর জন্য Route Handler দাও; failure-এর UI আগেই ভাবো।",
      },
    ],
  },
  {
    id: "react-essentials",
    title: "React Essentials",
    description:
      "Build a solid foundation in components, state, and everyday React.",
    category: "React",
    level: "Beginner",
    minutes: 40,
    color: "blue",
    lessons: [
      {
        id: "react-components",
        title: "Components, JSX & Props",
        duration: 10,
        intro:
          "Component হলো UI-এর পুনর্ব্যবহারযোগ্য অংশ। একটি course card একবার বানিয়ে data বদলে চারটি course দেখানো যায়। JSX-এ markup এবং JavaScript expression পাশাপাশি থাকে।",
        sections: [
          {
            title: "Describe a component with props",
            body: "Props component-এর input। TypeScript দিয়ে input-এর shape লিখলে ভুল field বা ভুল type editor-এই ধরা পড়ে। Props-কে পরিবর্তন না করে parent থেকে নতুন value পাঠাও। Component-এর নাম বড় হাতের অক্ষরে শুরু হয়।",
            code: "type CourseCardProps = {\n  title: string;\n  lessonCount: number;\n};\n\nfunction CourseCard({ title, lessonCount }: CourseCardProps) {\n  return (\n    <article>\n      <h2>{title}</h2>\n      <p>{lessonCount} lessons</p>\n    </article>\n  );\n}",
          },
          {
            title: "Render lists with stable keys",
            body: "array.map দিয়ে data থেকে UI বানাও। প্রতিটি sibling item-এর stable unique key দরকার, যাতে React item-এর identity বুঝতে পারে। Reorder বা delete হতে পারে এমন list-এ array index-এর বদলে data-এর id ব্যবহার করো।",
            code: "{courses.map((course) => (\n  <CourseCard\n    key={course.id}\n    title={course.title}\n    lessonCount={course.lessons.length}\n  />\n))}",
          },
          {
            title: "Keep components focused",
            body: "CourseCard course-এর summary দেখাবে; storage লেখা বা পুরো catalog filter করার সব logic card-এর মধ্যে রাখবে না। Focused component বুঝতে ও reuse করতে সহজ হয়। তবে প্রত্যেক ছোট div আলাদা component করারও দরকার নেই।",
          },
        ],
        challenge:
          "CourseCard-এ level prop যোগ করে Beginner বা Intermediate badge দেখাও। তারপর catalog-এর সব card-এ data থেকে level পাঠাও।",
        takeaway:
          "Props দিয়ে data ঢোকে, JSX দিয়ে UI বের হয়, stable key list item-এর identity ধরে রাখে।",
      },
      {
        id: "react-state",
        title: "State & User Interactions",
        duration: 10,
        intro:
          "Search লেখা, bookmark করা বা lesson select করার পর UI বদলাতে state লাগে। সাধারণ variable বদলালে React নতুন render শুরু করে না; state setter সেটি করে।",
        sections: [
          {
            title: "State is a snapshot",
            body: "useState current render-এর value এবং setter দেয়। Setter call করলেই ওই function-এর পুরোনো variable বদলে যায় না; পরের render নতুন value পায়। আগের state-এর ওপর নির্ভর করলে updater function ব্যবহার করো।",
            code: "const [count, setCount] = useState(0);\n\nfunction addTwo() {\n  setCount((previous) => previous + 1);\n  setCount((previous) => previous + 1);\n}",
          },
          {
            title: "Do not mutate arrays in state",
            body: "State array-এ push বা splice করে একই reference ফিরিয়ে দিও না। নতুন array বানাও। Bookmark toggle-এ id থাকলে filter দিয়ে সরানো হয়, না থাকলে spread দিয়ে যোগ করা হয়।",
            code: "setBookmarks((current) =>\n  current.includes(courseId)\n    ? current.filter((id) => id !== courseId)\n    : [...current, courseId]\n);",
          },
          {
            title: "Derive values instead of duplicating state",
            body: "Completed lesson IDs থেকে progress percentage হিসাব করা যায়। IDs এবং percentage দুটো আলাদা state-এ রাখলে একটির update বাদ পড়ে ভুল UI হতে পারে। এই project course lesson list-এর সঙ্গে completed IDs মিলিয়ে progress বের করে।",
            code: "const completed = course.lessons.filter((lesson) =>\n  completedIds.includes(lesson.id)\n).length;\nconst percent = Math.round(completed / course.lessons.length * 100);",
          },
        ],
        challenge:
          "একটি list-এ তিনটি task রাখো। checkbox click-এ নতুন array বানিয়ে task complete করো এবং সেই array থেকেই completed count বের করো।",
        takeaway:
          "State immutableভাবে update করো; হিসাব করে পাওয়া যায় এমন value আলাদা state-এ রেখো না।",
      },
      {
        id: "react-forms",
        title: "Forms & Useful Feedback",
        duration: 10,
        intro:
          "একটি ভালো form শুধু input আর submit button নয়। Label, validation, pending state এবং success message user-কে প্রতিটি ধাপে বোঝায় কী হচ্ছে।",
        sections: [
          {
            title: "Make inputs understandable",
            body: "প্রতিটি input-এর সঙ্গে label যুক্ত করো। Placeholder label-এর বিকল্প নয়, কারণ লেখা শুরু করলে সেটি হারিয়ে যায়। email, required এবং maxLength browser-কে সাহায্য করে, কিন্তু server-এ data save করলে সেখানেও validation লাগবে।",
            code: '<label htmlFor="email">Email address</label>\n<input\n  id="email"\n  name="email"\n  type="email"\n  required\n  autoComplete="email"\n/>',
          },
          {
            title: "Controlled inputs mirror state",
            body: "Search-এর জন্য value এবং onChange দিয়ে controlled input করা যায়। প্রতিটি keystroke state বদলায়, আর সেই state দিয়ে list filter হয়। Submit-based form-এ FormData ব্যবহার করেও field পড়া যায়; সব field-কে state করা জরুরি নয়।",
            code: 'const [query, setQuery] = useState("");\n\n<input\n  aria-label="Search courses"\n  value={query}\n  onChange={(event) => setQuery(event.target.value)}\n/>',
          },
          {
            title: "Report the actual outcome",
            body: "Request fail করলে success দেখিও না। Local demo হলে data শুধু device-এ save হয়েছে কি না স্পষ্ট বলো। Error message সংশ্লিষ্ট field-এর পাশে রাখো; status update-এর জন্য role='status' screen reader-কে সাহায্য করে। Pending request-এ duplicate submit বন্ধ করো।",
          },
        ],
        challenge:
          "একটি নামের form বানাও। trim করার পরে ফাঁকা হলে error দেখাও, valid হলে preview দেখাও। Submit-এর পরে focus কোথায় থাকে সেটিও keyboard দিয়ে পরীক্ষা করো।",
        takeaway:
          "Label, validation এবং সত্যিকারের ফলাফলের feedback একটি form-কে ব্যবহারযোগ্য করে।",
      },
      {
        id: "react-context",
        title: "Shared State & Browser Persistence",
        duration: 10,
        intro:
          "Dashboard, course card এবং lesson reader একই progress ব্যবহার করে। প্রতিটি page-এর আলাদা state হলে navigation-এর পরে data মিলবে না। এই অ্যাপের shared external store সেই state এক জায়গায় রাখে।",
        sections: [
          {
            title: "Subscribe to one shared store",
            body: "এই app-এর useWorkspace hook useSyncExternalStore দিয়ে shared store-এর পরিবর্তন শোনে। একটি action state বদলালে subscribed component নতুন snapshot পেয়ে render হয়। WorkspaceProvider storage warning দেখায়; এটি React Context provider নয়। React Context-ও shared value পৌঁছানোর একটি বিকল্প, তবে কোনো পদ্ধতিই নিজে database নয়।",
            code: 'const { state, completeLesson } = useWorkspace();\nconst isDone = state.completedLessonIds.includes(lesson.id);\n\n<button onClick={() => completeLesson(lesson.id)}>\n  {isDone ? "Completed" : "Mark complete"}\n</button>',
          },
          {
            title: "Load storage after hydration",
            body: "localStorage browser origin অনুযায়ী data ধরে রাখে। Page refresh-এর পরে JSON পড়ে validate করে state restore করতে হয়। Stored data corrupt হতে পারে, storage blocked হতে পারে, অথবা পুরোনো schema থাকতে পারে। তাই try/catch এবং safe defaults দরকার।",
            code: 'try {\n  const raw = localStorage.getItem("my-learning-state");\n  const parsed: unknown = raw ? JSON.parse(raw) : null;\n  // Validate parsed before using it as application state.\n} catch {\n  // Keep the app usable with in-memory state.\n}',
          },
          {
            title: "Make completion idempotent",
            body: "একই lesson-এর complete button দুইবার চাপলেও completed count দুইবার বাড়া উচিত নয়। Action-এ id আগে আছে কি না পরীক্ষা করতে হয়। এই নিয়ম UI-এর disabled button-এর বাইরেও data ঠিক রাখে।",
          },
        ],
        challenge:
          "একটি lesson complete করে dashboard-এ যাও এবং page refresh করো। তারপর একই lesson আবার complete করলে progress একই থাকে কি না দেখো।",
        takeaway:
          "Shared store সব page-এ একই state দেয়; validated storage refresh-এর পরে state ফেরায়; idempotent actions data ঠিক রাখে।",
      },
    ],
  },
  {
    id: "typescript-toolkit",
    title: "TypeScript Toolkit",
    description:
      "Write clearer code and catch mistakes before they reach the browser.",
    category: "TypeScript",
    level: "Beginner",
    minutes: 35,
    color: "amber",
    lessons: [
      {
        id: "typescript-types",
        title: "Types That Explain Your Data",
        duration: 8,
        intro:
          "TypeScript JavaScript-এর ওপর static type checking যোগ করে। ভালো type code পড়ার সময় বলে দেয় কোন data আশা করা হচ্ছে এবং ভুল usage editor-এ ধরতে সাহায্য করে।",
        sections: [
          {
            title: "Model a real object",
            body: "প্রথমে app-এর data-এর shape লিখো। Course-এ id, title এবং lessons আছে। duration number হওয়ায় ভুল করে string দিলে compiler ধরবে। Type annotation runtime-এ object বানায় না বা data validate করে না।",
            code: 'type Lesson = {\n  id: string;\n  title: string;\n  duration: number;\n};\n\nconst lesson: Lesson = {\n  id: "routing",\n  title: "App Router",\n  duration: 10,\n};',
          },
          {
            title: "Use unions for known choices",
            body: "যে field-এর valid value সীমিত, সেখানে string-এর বদলে union type ব্যবহার করো। এতে typo কমে এবং autocomplete ভালো হয়। Optional property-তে প্রশ্নচিহ্ন মানে field না-ও থাকতে পারে।",
            code: 'type Course = {\n  title: string;\n  level: "Beginner" | "Intermediate";\n  subtitle?: string;\n  lessons: Lesson[];\n};',
          },
        ],
        challenge:
          "একটি Project type বানাও: id, title এবং status, যেখানে status শুধু 'planned', 'active' বা 'done' হতে পারবে। ভুল status দিয়ে compiler message পড়ো।",
        takeaway:
          "Type হলো data-এর লিখিত চুক্তি; union পরিচিত value সীমিত করে, optional property অনুপস্থিতি প্রকাশ করে।",
      },
      {
        id: "typescript-narrowing",
        title: "Narrowing & Safe Branches",
        duration: 9,
        intro:
          "সব value শুরু থেকেই নিশ্চিত নয়। find() কোনো record নাও পেতে পারে। API বা storage থেকে unknown data আসতে পারে। Condition দিয়ে type নিশ্চিত করার প্রক্রিয়াই narrowing।",
        sections: [
          {
            title: "Check before using a value",
            body: "Array.find-এর result object বা undefined হতে পারে। যদি value না থাকে return বা notFound করলে বাকি branch-এ TypeScript জানে object আছে। জোর করে ! দিয়ে compiler চুপ করানোর বদলে বাস্তব missing case সামলাও।",
            code: 'const course = courses.find((item) => item.id === slug);\n\nif (!course) {\n  return "Course not found";\n}\n\n// course is now known to exist.\nreturn course.title;',
          },
          {
            title: "Unknown is a useful boundary",
            body: "unknown বলছে value-এর shape এখনো জানা নেই। typeof, Array.isArray এবং schema validation দিয়ে আগে নিশ্চিত হও। any ব্যবহার করলে এই পরীক্ষা এড়িয়ে যাওয়া যায়, ফলে compiler আর সাহায্য করতে পারে না।",
            code: 'function displayName(value: unknown): string {\n  if (typeof value === "string" && value.trim()) {\n    return value.trim();\n  }\n  return "Learner";\n}',
          },
          {
            title: "Prefer precise states",
            body: "একসঙ্গে isLoading, hasError এবং isSuccess boolean রাখলে অসম্ভব combination তৈরি হতে পারে। status union দিয়ে loading, success ও error আলাদা branch করা সহজ। Success data শুধু success branch-এই রাখো।",
          },
        ],
        challenge:
          "displayName-এ null, 42, empty string এবং '  Ayesha  ' পাঠিয়ে result দেখো। কোনো type assertion ছাড়া function নিরাপদ রাখো।",
        takeaway:
          "Condition দিয়ে অনিশ্চয়তা কমাও; unknown value যাচাই করো এবং missing data-এর branch লিখো।",
      },
      {
        id: "typescript-generics",
        title: "Reusable Functions with Generics",
        duration: 9,
        intro:
          "Generic একটি function-কে reusable রাখে, একই সঙ্গে input ও output-এর type-এর সম্পর্ক ধরে রাখে। any দিয়ে সেই সম্পর্ক হারিয়ে যায়।",
        sections: [
          {
            title: "Preserve the input type",
            body: "first function string array পেলে string বা undefined, আর Lesson array পেলে Lesson বা undefined দেবে। T placeholder call-এর input থেকে infer হয়। Empty array-এর জন্য undefined return type-এ রাখতেই হবে।",
            code: 'function first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst name = first(["Ayesha", "Rafi"]);\n// string | undefined\n\nconst lesson = first(course.lessons);\n// Lesson | undefined',
          },
          {
            title: "Constrain only what you need",
            body: "যদি function-এর শুধু id দরকার হয়, generic-কে { id: string } দিয়ে constrain করো। এখন course এবং lesson দুটোর list-এ function কাজ করবে, অথচ input-এর পুরো type output-এ থাকবে।",
            code: "function findById<T extends { id: string }>(\n  items: T[],\n  id: string,\n): T | undefined {\n  return items.find((item) => item.id === id);\n}",
          },
          {
            title: "Keep abstractions useful",
            body: "শুধু এক জায়গায় সহজ logic থাকলে generic utility বানানো জরুরি নয়। বাস্তবে একই pattern বারবার আসলে abstraction করো। Type parameter যত কম এবং সম্পর্ক যত পরিষ্কার, code বোঝা তত সহজ।",
          },
        ],
        challenge:
          "findById দিয়ে courses এবং একটি task array থেকে item খুঁজে বের করো। Editor-এ দুই result-এর autocomplete আলাদা হচ্ছে কি না দেখো।",
        takeaway:
          "Generic reusable logic-এর input-output type সম্পর্ক ধরে; constraint function-এর প্রয়োজনটুকু জানায়।",
      },
      {
        id: "typescript-validation",
        title: "Runtime Validation with Zod",
        duration: 9,
        intro:
          "TypeScript build-এর সময় সাহায্য করে, কিন্তু browser form, HTTP request বা localStorage-এর data compile-time type মানতে বাধ্য নয়। বাইরের data-এর boundary-তে runtime validation লাগে।",
        sections: [
          {
            title: "A cast is not validation",
            body: "JSON.parse(raw) as Profile লিখলে TypeScript তোমার কথা বিশ্বাস করে, কিন্তু data বদলে যায় না বা check হয় না। JSON-এ name number হলে runtime-এ string method crash করতে পারে। Schema দিয়ে actual value যাচাই করো।",
            code: 'import { z } from "zod";\n\nconst ProfileSchema = z.object({\n  name: z.string().trim().min(1).max(60),\n  dailyGoal: z.number().int().min(5).max(120),\n});\n\ntype Profile = z.infer<typeof ProfileSchema>;',
          },
          {
            title: "Handle success and failure explicitly",
            body: "safeParse exception না ছুড়ে success field-সহ result দেয়। success branch-এ parsed.data validated এবং typed। Error branch-এ user-কে actionable feedback দাও বা stored data হলে default state ব্যবহার করো।",
            code: 'const result = ProfileSchema.safeParse(input);\n\nif (!result.success) {\n  return { error: "Check your name and daily goal." };\n}\n\nconst profile = result.data;\nreturn { name: profile.name };',
          },
          {
            title: "Validation belongs at the boundary",
            body: "Form UI-এর validation user-কে দ্রুত feedback দেয়। Server-এ data mutation থাকলে আবার validate করতে হবে, কারণ HTTP request সরাসরি করা যায়। এই demo-তে local state browser-এই থাকে; database যোগ করলে server authorization-ও দরকার হবে।",
          },
        ],
        challenge:
          "ProfileSchema-তে valid object, ফাঁকা name এবং string dailyGoal পাঠাও। প্রতিবার safeParse result দেখো এবং error branch সত্যি কাজ করছে কি না পরীক্ষা করো।",
        takeaway:
          "TypeScript code-এর contract check করে; Zod runtime input check করে। দুটির কাজ আলাদা এবং পরিপূরক।",
      },
    ],
  },
  {
    id: "fullstack-patterns",
    title: "Full-stack Patterns",
    description:
      "Connect the pieces with APIs, validation, and production-minded habits.",
    category: "Next.js",
    level: "Intermediate",
    minutes: 50,
    color: "green",
    lessons: [
      {
        id: "fullstack-architecture",
        title: "A Structure That Can Grow",
        duration: 12,
        intro:
          "একটি বড় project শুধু বেশি file নয়। প্রতিটি file-এর দায়িত্ব পরিষ্কার এবং data flow বোঝা যায় এমন হওয়াই মূল বিষয়। এই অ্যাপ route, feature ও shared component আলাদা করে সাজানো।",
        sections: [
          {
            title: "Organize around features",
            body: "app folder routing ও framework convention রাখে। features/courses-এ course data, catalog ও reader থাকে। Shared UI components আলাদা। এতে courses-এর কাজ করতে গেলে প্রাসঙ্গিক code কাছাকাছি পাওয়া যায়।",
            code: "src/\n├── app/                 # routes, metadata, error boundaries\n├── components/          # shared shell and UI\n└── features/\n    ├── courses/         # catalog, content, lesson reader\n    └── workspace/       # shared state and persistence",
          },
          {
            title: "Follow the data flow",
            body: "Course data server page থেকে client reader-এ props হিসেবে যায়। Reader action dispatch করে workspace state বদলায়। Dashboard সেই একই state থেকে progress হিসাব করে। কোন data কোথায় বদলায় তা নির্দিষ্ট থাকলে bug খুঁজতে সুবিধা হয়।",
          },
          {
            title: "Keep one source of truth",
            body: "Course title API, card ও reader-এর জন্য তিন জায়গায় লিখো না। Shared typed data থেকে প্রত্যেকে নিজের প্রয়োজনের অংশ নিক। API response-এ পুরো lesson body না দিয়ে summary দিলে payload ছোট হয় এবং public contract পরিষ্কার থাকে।",
          },
        ],
        challenge:
          "এই project-এ একটি course title বদলাও। Catalog, lesson page এবং /api/courses-এ পরিবর্তন পৌঁছায় কি না দেখো। এরপর title-এর original value ফিরিয়ে দাও।",
        takeaway:
          "Route thin রাখো, feature code কাছাকাছি রাখো এবং একই data-এর একাধিক copy এড়াও।",
      },
      {
        id: "fullstack-api-design",
        title: "Design a Predictable API",
        duration: 12,
        intro:
          "API অন্য program-এর সঙ্গে তোমার app-এর চুক্তি। URL, input, response shape এবং status code নিয়মিত থাকলে frontend ও backend আলাদা করে বোঝা সহজ হয়।",
        sections: [
          {
            title: "Give a request one clear job",
            body: "GET /api/courses summary list ফেরায় এবং query parameter দিয়ে filter করে। GET request data পড়বে; user progress বদলানোর কাজ করবে না। Course summary-তে id, title, category এবং lessonCount থাকলেই catalog consumer শুরু করতে পারে।",
            code: 'GET /api/courses?q=react&category=React\n\n{\n  "courses": [\n    {\n      "id": "react-essentials",\n      "title": "React Essentials",\n      "category": "React",\n      "lessonCount": 4\n    }\n  ],\n  "total": 1\n}',
          },
          {
            title: "Use status codes consistently",
            body: "Successful empty search-ও 200: request valid, শুধু match নেই। Malformed input হলে 400, missing individual resource হলে 404, unexpected server error হলে 500 উপযুক্ত। Error-এ internal stack trace বা secret ফেরানো উচিত নয়।",
          },
          {
            title: "Keep the demo boundary honest",
            body: "এই project-এর course API read-only। Learning progress browser storage-এ থাকে; API-তে user account বা progress database নেই। Backend যোগ করার সময় user identity, authorization, database persistence এবং request validation একসঙ্গে design করতে হবে।",
          },
        ],
        challenge:
          "/api/courses?category=React এবং /api/courses?q=unknown খোলো। JSON-এর total field এবং result list-এর length মিলছে কি না দেখো।",
        takeaway:
          "Clear request semantics, consistent response এবং সঠিক status code একটি API-কে predictable করে।",
      },
      {
        id: "fullstack-reliability",
        title: "Reliable State & Edge Cases",
        duration: 13,
        intro:
          "Happy path-এ click করলে কাজ করাই যথেষ্ট নয়। Refresh, double click, empty data এবং unavailable storage—এই স্বাভাবিক পরিস্থিতিগুলোও app-এর design-এর অংশ।",
        sections: [
          {
            title: "Write invariants before clever code",
            body: "Invariant হলো যে নিয়ম সবসময় সত্য থাকবে। একটি lesson একবারই completed count-এ থাকবে। Progress 0 থেকে 100-এর মধ্যে থাকবে। অজানা course ID stored থাকলে visible progress বাড়াবে না। এই নিয়ম ধরে action ও derived selectors লিখলে state নির্ভরযোগ্য হয়।",
            code: "function addCompleted(ids: string[], lessonId: string) {\n  return ids.includes(lessonId) ? ids : [...ids, lessonId];\n}\n\nconst done = course.lessons.filter((lesson) =>\n  completedIds.includes(lesson.id)\n).length;",
          },
          {
            title: "Treat persisted data as input",
            body: "localStorage edit করা যায় এবং আগের app version-এর data থাকতে পারে। JSON parsing সফল হলেই data valid নয়। Schema, version এবং defaults ব্যবহার করো। Storage write fail করলে UI usable রাখো এবং save হয়নি তা user-কে জানাও।",
          },
          {
            title: "Test the user's journey",
            body: "শুধু function input-output নয়: lesson complete → dashboard progress → refresh → একই progress, এই journey পরীক্ষা করো। Keyboard দিয়ে course link ও bookmark পৌঁছানো যায় কি না এবং mobile-এ content overflow হয় কি না দেখো।",
          },
        ],
        challenge:
          "একটি course complete করো, refresh করো এবং একই lesson আবার complete করো। Count না-বাড়া যাচাই করো। আলাদা browser profile খুলে data যে share হয় না সেটিও দেখো।",
        takeaway:
          "স্পষ্ট invariants এবং বাস্তব user journey edge case সামলানোর ভিত্তি।",
      },
      {
        id: "fullstack-shipping",
        title: "From Working to Ready to Share",
        duration: 13,
        intro:
          "Development server-এ page দেখা আর production build ready হওয়া আলাদা checkpoint। Types, lint, build এবং গুরুত্বপূর্ণ user flow check করে project share করো।",
        sections: [
          {
            title: "Use the project's checks",
            body: "এই project-এ typecheck TypeScript error, lint code issue এবং build production compilation পরীক্ষা করে। কোনো check pass করলেই সব bug নেই—এমন নয়। বরং প্রত্যেকটি আলাদা ধরনের problem খুঁজতে সাহায্য করে।",
            code: "npm run typecheck\nnpm run lint\nnpm run build\n\n# Run the production output after a successful build:\nnpm run start",
          },
          {
            title: "Check the experience",
            body: "Small mobile viewport, keyboard-only navigation এবং browser back button দিয়ে app ব্যবহার করো। Form error ও empty search দেখো। Refresh-এর পরে local progress থাকে কি না দেখো। Link যদি অন্য route-এ নিয়ে যায়, সেই route সরাসরি খুলেও কাজ করতে হবে।",
          },
          {
            title: "Document what is real",
            body: "README-তে setup, architecture এবং data কোথায় থাকে লিখে দাও। Demo-তে authentication বা database না থাকলে সেটি স্পষ্ট করো। অন্য developer যেন clone করার পর app চালাতে এবং একটি feature-এর code খুঁজে পেতে পারে।",
            code: "# A useful handoff\n1. Install dependencies and start the app.\n2. Explain the main user journey.\n3. Map routes to feature files.\n4. Describe persistence and limitations.\n5. List checks and follow-up exercises.",
          },
        ],
        challenge:
          "README অনুসরণ করে project build করো। তারপর অন্য কাউকে course খুঁজে একটি lesson complete করতে দাও। কোথায় সে আটকে যায় তা লিখে একটি ছোট UX improvement করো।",
        takeaway:
          "Ready to share মানে checked code, usable flows এবং বাস্তব behavior ব্যাখ্যা করা documentation।",
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}
