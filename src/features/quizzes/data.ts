export type QuizQuestion = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctOption: number;
  explanation: string;
};

// Stable question IDs associate each selected option with its question in an attempt.
// These practice answers are public course content, not a secure examination.
export const quizByLessonId: Record<string, QuizQuestion[]> = {
  "nextjs-routing": [
    {
      id: "nextjs-routing-route-file",
      prompt:
        "src/app/hello folder বানিয়েছ, কিন্তু /hello খুলছে না। কোন file যোগ করলে page প্রকাশ পাবে?",
      options: [
        "hello folder-এ শুধু layout.tsx",
        "hello folder-এ page.tsx",
        "src/components/hello.tsx",
        "public/hello.tsx",
      ],
      correctOption: 1,
      explanation:
        "App Router-এ folder URL-এর অংশ নির্ধারণ করে; সেই route-এর content প্রকাশ করতে page.tsx লাগে। তাই src/app/hello/page.tsx হলো /hello-এর page।",
    },
    {
      id: "nextjs-routing-shared-layout",
      prompt:
        "Dashboard ও courses page-এ একই sidebar রাখতে চাও। কোন জায়গাটি উপযুক্ত?",
      options: [
        "দুই page-এ sidebar-এর code আলাদা করে copy করা",
        "প্রতিটি course-এর data object-এ sidebar রাখা",
        "একটি API response-এ sidebar-এর JSX ফেরানো",
        "Shared layout.tsx-এ children-এর পাশে sidebar রাখা",
      ],
      correctOption: 3,
      explanation:
        "Layout shared UI-কে children-এর চারপাশে রাখে। Page নিজস্ব content দেখায়; sidebar-এর মতো অংশ layout-এ রাখলে সব route-এ একই structure ব্যবহার হয়।",
    },
    {
      id: "nextjs-routing-internal-link",
      prompt:
        "অ্যাপের ভেতরে /courses-এ যেতে client-side navigation ও link-এর স্বাভাবিক আচরণ কোনটি দেয়?",
      options: [
        'next/link-এর <Link href="/courses">',
        "শুধু একটি <span>Courses</span>",
        "onClick ছাড়া একটি <button>Courses</button>",
        'শুধু একটি <div href="/courses">',
      ],
      correctOption: 0,
      explanation:
        "next/link route বদলানোর জন্য তৈরি। এটি client-side navigation দেয়, আর keyboard navigation, browser back ও নতুন tab-এ খোলার মতো link behavior বজায় রাখে।",
    },
  ],
  "nextjs-server-client": [
    {
      id: "nextjs-server-client-interactive-boundary",
      prompt:
        "Server page-এ একটি counter যোগ করবে। Counter-এ useState ও onClick দরকার। কী করবে?",
      options: [
        "সব course data file-এ 'use client' লিখবে",
        "শুধু page-এর metadata মুছে দেবে",
        "আলাদা Counter file-এ 'use client' দিয়ে page থেকে render করবে",
        "Server Component-এর মধ্যে localStorage দিয়ে count বদলাবে",
      ],
      correctOption: 2,
      explanation:
        "State ও event handler-এর জন্য client boundary দরকার। শুধু interactive Counter-কে Client Component রাখলে বাকি page Server Component হিসেবেই থাকতে পারে।",
    },
    {
      id: "nextjs-server-client-secret-boundary",
      prompt:
        "Server Component একটি secret API key দিয়ে data আনে। Client reader-এ কী পাঠানো উচিত?",
      options: [
        "UI-এর প্রয়োজনীয় serializable data, secret key বাদ দিয়ে",
        "Secret key-সহ পুরো server configuration",
        "Secret key-কে prop-এর অন্য নাম দিয়ে",
        "Secret key-কে localStorage-এ রাখার নির্দেশ",
      ],
      correctOption: 0,
      explanation:
        "Server-এ secret ব্যবহার করা যায়, কিন্তু client props-এ পাঠালে তা আর গোপন থাকে না। Reader শুধু তার UI-এর জন্য প্রয়োজনীয় data পাবে।",
    },
    {
      id: "nextjs-server-client-storage-render",
      prompt:
        "Client Component-এর render-এর সময় সরাসরি localStorage পড়া সমস্যার কারণ হতে পারে কেন?",
      options: [
        "Client Component কখনো HTML পায় না",
        "localStorage সবসময় server database থেকে পড়ে",
        "'use client' লিখলে storage নিজে থেকেই validate হয়",
        "প্রথম HTML server-এ তৈরি হতে পারে, যেখানে localStorage নেই",
      ],
      correctOption: 3,
      explanation:
        "Client Component-ও প্রথম load-এ server-rendered HTML পেতে পারে। Browser storage render-এর বাইরে hydration-এর সময় পড়লে server error ও hydration mismatch এড়ানো সহজ হয়।",
    },
  ],
  "nextjs-dynamic-routes": [
    {
      id: "nextjs-dynamic-routes-promise-params",
      prompt:
        "এই Next.js version-এ /courses/[slug]/page.tsx-এর async page থেকে slug কীভাবে পড়বে?",
      options: [
        "সবসময় params.slug সরাসরি পড়বে",
        "const { slug } = await params লিখবে",
        "layout-এর children-কে slug হিসেবে ব্যবহার করবে",
        "প্রতিটি slug-এর জন্য নতুন page file বানাবে",
      ],
      correctOption: 1,
      explanation:
        "এই version-এ page-এর params একটি Promise। Await করার পরে [slug] folder-এর নাম অনুযায়ী slug property পাওয়া যায়।",
    },
    {
      id: "nextjs-dynamic-routes-metadata-boundary",
      prompt:
        "Course title অনুযায়ী browser tab-এর title বদলাবে, আর reader interactive থাকবে। কোন structure উপযুক্ত?",
      options: [
        "Client reader-এ metadata export করলেই হবে",
        "Title শুধু localStorage-এ রাখবে",
        "Server page-এ generateMetadata এবং আলাদা Client Component reader রাখবে",
        "Dynamic route হলে কোনো metadata দেওয়া যায় না",
      ],
      correctOption: 2,
      explanation:
        "Data অনুযায়ী metadata তৈরির জন্য generateMetadata আছে। Metadata API server-এ ব্যবহৃত হয়, তাই interactive reader আলাদা client file-এ রাখা হয়।",
    },
    {
      id: "nextjs-dynamic-routes-missing-course",
      prompt:
        "User URL-এর slug বদলে এমন course চেয়েছে যা data-তে নেই। Page-এর কী করা উচিত?",
      options: [
        "notFound() call করে missing resource-এর UI দেখানো",
        "Empty course title নিয়ে reader render করা",
        "প্রথম course-টিকে ওই slug-এর course বলে দেখানো",
        "Unknown slug-টিকে completed lesson হিসেবে save করা",
      ],
      correctOption: 0,
      explanation:
        "URL user বদলাতে পারে, তাই missing data সামলাতে হবে। notFound() বর্তমান rendering থামিয়ে nearest not-found.tsx-এর UI দেখায়।",
    },
  ],
  "nextjs-data-api": [
    {
      id: "nextjs-data-api-shared-server-data",
      prompt:
        "Server Component-এ এই project-এর local courses data দরকার। কীভাবে পড়া সবচেয়ে সরাসরি?",
      options: [
        "নিজের /api/courses-এ HTTP request করতেই হবে",
        "আগে browser localStorage-এ সব course copy করতে হবে",
        "প্রতিটি page-এ course data আবার লিখতে হবে",
        "Shared data function সরাসরি import করতে হবে",
      ],
      correctOption: 3,
      explanation:
        "Server-এর একই data function সরাসরি import করা যায়। নিজের API-তে HTTP request করলে এই ক্ষেত্রে অপ্রয়োজনীয় network hop যোগ হয়।",
    },
    {
      id: "nextjs-data-api-json-route-handler",
      prompt: "GET /api/courses থেকে JSON response দিতে কোনটি ব্যবহার করবে?",
      options: [
        "app/api/courses/page.tsx-এ একটি heading",
        "app/api/courses/route.ts-এ exported GET function",
        "courses-এর layout.tsx-এ একটি onClick",
        "public/courses.tsx-এ একটি React component",
      ],
      correctOption: 1,
      explanation:
        "Route Handler-এর route.ts file-এ GET HTTP request সামলায় এবং Response.json দিয়ে JSON ফেরাতে পারে। এটি layout-এর মধ্যে render হওয়া page নয়।",
    },
    {
      id: "nextjs-data-api-external-fetch-failure",
      prompt:
        "External API থেকে fetch করার পরে response.ok false হয়েছে। Lesson অনুযায়ী কী করা উচিত?",
      options: [
        "তবুও সফল request-এর message দেখানো",
        "Status উপেক্ষা করে সব response-কে course list ধরা",
        "Failure শনাক্ত করে error path ও বোঝা যায় এমন UI ব্যবহার করা",
        "Failure-কে user-এর completed lesson হিসেবে গণনা করা",
      ],
      correctOption: 2,
      explanation:
        "Fetch-এর HTTP response সফল কি না response.ok দিয়ে পরীক্ষা করতে হবে। Unexpected failure, empty search এবং missing record আলাদা পরিস্থিতি; প্রত্যেকটির উপযুক্ত UI থাকা দরকার।",
    },
  ],
  "react-components": [
    {
      id: "react-components-props-update",
      prompt:
        "একটি CourseCard-এর title বদলাতে চাও। Props-এর সঙ্গে কোন আচরণটি সঠিক?",
      options: [
        "Card-এর ভেতর props.title সরাসরি বদলানো",
        "Parent থেকে নতুন title prop পাঠানো",
        "Title বদলাতে প্রতিবার নতুন route বানানো",
        "Props-এর type মুছে দিয়ে title বদলানো",
      ],
      correctOption: 1,
      explanation:
        "Props component-এর input। Child সেই input mutate করবে না; parent নতুন value পাঠালে card নতুন title দেখাবে।",
    },
    {
      id: "react-components-stable-list-key",
      prompt:
        "Course list-এ reorder ও delete হতে পারে। map-এর প্রতিটি CourseCard-এর key হিসেবে কোনটি নেবে?",
      options: [
        "প্রতিবার render-এ নতুন random value",
        "সব card-এর জন্য একই 'course' string",
        "List-এর বর্তমান array index",
        "প্রতিটি course-এর stable unique id",
      ],
      correctOption: 3,
      explanation:
        "React key দিয়ে sibling item-এর identity বোঝে। Stable data ID ব্যবহার করলে item-এর অবস্থান বদলালেও পরিচয় ঠিক থাকে; index বা নতুন random key সেই নিশ্চয়তা দেয় না।",
    },
    {
      id: "react-components-focused-card",
      prompt:
        "CourseCard component-এর দায়িত্ব কোনটুকু রাখলে lesson-এর design অনুসরণ করা হয়?",
      options: [
        "Props থেকে একটি course-এর summary দেখানো",
        "পুরো app-এর routing ও storage একাই পরিচালনা করা",
        "সব page-এর state নিজের ভেতরে আলাদা করে রাখা",
        "প্রতিটি JSX div-কে আলাদা feature বানানো",
      ],
      correctOption: 0,
      explanation:
        "CourseCard-এর মূল কাজ একটি course-এর summary দেখানো। Catalog filtering ও সব storage logic card-এ ঢোকালে তার দায়িত্ব অস্পষ্ট হয় এবং reuse কঠিন হয়।",
    },
  ],
  "react-state": [
    {
      id: "react-state-queued-updaters",
      prompt:
        "Count শুরুতে 0। একই handler-এ setCount(n => n + 1) দুবার call করলে পরের render-এ count কত হবে?",
      options: ["0", "1", "2", "পুরোনো variable সঙ্গে সঙ্গে 2 হয়ে যাবে"],
      correctOption: 2,
      explanation:
        "প্রতিটি updater আগের update-এর result থেকে নতুন state বের করে, তাই পরের render-এ count 2। Current render-এর count variable setter call-এর সঙ্গে সঙ্গে বদলায় না।",
    },
    {
      id: "react-state-immutable-bookmark",
      prompt:
        "State-এর bookmarks array-এ একটি courseId যোগ করতে কোন update উপযুক্ত?",
      options: [
        "setBookmarks(current => [...current, courseId])",
        "bookmarks.push(courseId) করে একই array ফেরানো",
        "bookmarks[0] সরাসরি courseId দিয়ে বদলে দেওয়া",
        "শুধু একটি সাধারণ variable-এ courseId রেখে দেওয়া",
      ],
      correctOption: 0,
      explanation:
        "State array mutate না করে নতুন array বানাতে হয়। Spread পুরোনো items নিয়ে নতুন array তৈরি করে, যেটি React state হিসেবে গ্রহণ করতে পারে।",
    },
    {
      id: "react-state-derived-progress",
      prompt:
        "Completed lesson IDs ইতিমধ্যে state-এ আছে। Progress percentage কীভাবে রাখা ভালো?",
      options: [
        "প্রতিটি card-এ নিজের মতো hardcode করা",
        "IDs থেকে আলাদা state-এ রেখে update না করা",
        "শুধু button click-এর সংখ্যা দিয়ে হিসাব করা",
        "Course-এর lesson list ও completed IDs মিলিয়ে হিসাব করা",
      ],
      correctOption: 3,
      explanation:
        "IDs থেকে percentage derive করা যায়। একই তথ্য দুইটি state-এ রাখলে একটি update বাদ পড়ে অসামঞ্জস্য হতে পারে; course-এর valid lessons মিলিয়ে হিসাব করলে সঠিক progress পাওয়া যায়।",
    },
  ],
  "react-forms": [
    {
      id: "react-forms-input-label",
      prompt: "Email input-এ placeholder আছে। তবুও label যুক্ত করা দরকার কেন?",
      options: [
        "Label থাকলে server validation আর লাগে না",
        "লেখা শুরু করলে placeholder হারায়; label input-এর পরিচয় স্পষ্ট রাখে",
        "Label নিজে থেকেই email পাঠিয়ে দেয়",
        "Label ছাড়া React কোনো input render করতে পারে না",
      ],
      correctOption: 1,
      explanation:
        "Placeholder label-এর বিকল্প নয়। Label-এর htmlFor এবং input-এর id মিলিয়ে দিলে field-এর পরিচয় স্পষ্ট থাকে, placeholder হারিয়ে গেলেও।",
    },
    {
      id: "react-forms-controlled-search",
      prompt:
        "প্রতিটি keystroke-এ query state বদলে course filter করতে কোন input pattern ব্যবহার করবে?",
      options: [
        "শুধু placeholder-এ query লিখবে",
        "value দেবে কিন্তু onChange-এ কোনো state update করবে না",
        "value={query} এবং onChange-এ setQuery ব্যবহার করবে",
        "Input-এর বদলে একটি static paragraph রাখবে",
      ],
      correctOption: 2,
      explanation:
        "Controlled input-এর value state থেকে আসে এবং onChange নতুন লেখা state-এ পাঠায়। সেই query থেকে filtered list তৈরি করা যায়।",
    },
    {
      id: "react-forms-honest-form-feedback",
      prompt:
        "Demo form শুধু input validate করেছে, email পাঠায়নি। Success feedback-এ কী বলা উচিত?",
      options: [
        "Validation সফল হয়েছে এবং email পাঠানো হয়নি—এটি স্পষ্ট বলা",
        "Email delivered বলা, যাতে message সুন্দর শোনায়",
        "কোনো feedback না দিয়ে সব input মুছে ফেলা",
        "Validation সফল হলে server validation সবসময় অপ্রয়োজনীয় বলা",
      ],
      correctOption: 0,
      explanation:
        "Form-এর feedback বাস্তব ফলাফল জানাবে। Demo-তে যা সত্যি ঘটেছে সেটিই বলতে হবে; delivery না হলে email পাঠানোর দাবি করা যাবে না।",
    },
  ],
  "react-context": [
    {
      id: "react-context-shared-snapshot",
      prompt:
        "Reader-এ lesson complete করার পরে dashboard একই progress দেখায় কীভাবে?",
      options: [
        "প্রতিটি page তার নিজস্ব unrelated state রাখে",
        "Dashboard প্রতিবার random progress তৈরি করে",
        "শুধু page-এর metadata বদলায়",
        "দুটি component একই workspace store-এর snapshot subscribe করে",
      ],
      correctOption: 3,
      explanation:
        "useWorkspace shared store-এর পরিবর্তন useSyncExternalStore দিয়ে শোনে। Action state বদলালে subscribed reader ও dashboard একই নতুন snapshot পায়।",
    },
    {
      id: "react-context-restore-storage",
      prompt:
        "Refresh-এর পরে localStorage থেকে পাওয়া JSON দিয়ে state restore করার সময় কী করতে হবে?",
      options: [
        "JSON.parse সফল হলেই সব field বিশ্বাস করতে হবে",
        "Data validate করতে হবে এবং storage বা parsing error-এর fallback রাখতে হবে",
        "Storage থাকলেই এটিকে authenticated account বলতে হবে",
        "সবসময় server render-এর সময় localStorage পড়তে হবে",
      ],
      correctOption: 1,
      explanation:
        "Stored JSON corrupt, পুরোনো বা ভুল shape-এর হতে পারে; storage-ও unavailable হতে পারে। Validation, try/catch ও usable defaults state restore-কে নির্ভরযোগ্য রাখে।",
    },
    {
      id: "react-context-idempotent-completion",
      prompt:
        "একই lesson-এর complete action দুবার call হলো। Correct completed count কীভাবে রাখবে?",
      options: [
        "প্রতিটি call-এ count এক করে বাড়াবে",
        "শুধু button-এর রং বদলাবে, state check করবে না",
        "Action-এ lesson ID আগে আছে কি না দেখে একবারই যোগ করবে",
        "দ্বিতীয় click হলে অন্য lesson complete করে দেবে",
      ],
      correctOption: 2,
      explanation:
        "Completion idempotent হলে একই action আবার হলেও ফল বদলায় না। Action-এর মধ্যে duplicate ID check থাকলে শুধু disabled button-এর ওপর নির্ভর করতে হয় না।",
    },
  ],
  "typescript-types": [
    {
      id: "typescript-types-static-contract",
      prompt:
        "Lesson type-এ duration: number লেখা আছে। এই annotation মূলত কী করে?",
      options: [
        "Runtime-এ যেকোনো string-কে number বানায়",
        "Code-এ duration-এর ভুল type ব্যবহার compile-time-এ ধরতে সাহায্য করে",
        "External JSON সবসময় valid করে দেয়",
        "নিজে থেকেই একটি Lesson object তৈরি করে",
      ],
      correctOption: 1,
      explanation:
        "TypeScript annotation data-এর static contract। এটি editor ও build-এর সময় ভুল ধরতে সাহায্য করে, কিন্তু runtime input বদলায় না বা validate করে না।",
    },
    {
      id: "typescript-types-status-union",
      prompt:
        "Project status শুধু planned, active বা done হতে পারবে। কোন type এই সীমা প্রকাশ করে?",
      options: [
        "status: string",
        "status: number",
        "status: any",
        'status: "planned" | "active" | "done"',
      ],
      correctOption: 3,
      explanation:
        "Literal union পরিচিত valid value-গুলো স্পষ্ট করে। সাধারণ string সব string গ্রহণ করে, তাই status-এর typo ধরার জন্য union বেশি নির্দিষ্ট।",
    },
    {
      id: "typescript-types-optional-property",
      prompt: "Course type-এ subtitle?: string লেখা থাকলে কী বোঝায়?",
      options: [
        "subtitle property না-ও থাকতে পারে; থাকলে string হবে",
        "subtitle সবসময় থাকতে হবে এবং number হবে",
        "TypeScript নিজে থেকেই subtitle তৈরি করবে",
        "subtitle-এ যেকোনো type রাখা যাবে",
      ],
      correctOption: 0,
      explanation:
        "Property-এর পরে ? সেটিকে optional করে। তাই field অনুপস্থিত হতে পারে, আর ব্যবহার করার সময় অনুপস্থিতির সম্ভাবনাটি মাথায় রাখতে হয়।",
    },
  ],
  "typescript-narrowing": [
    {
      id: "typescript-narrowing-missing-find-result",
      prompt:
        "courses.find(...) কোনো result না-ও দিতে পারে। course.title পড়ার আগে কী করবে?",
      options: [
        "শুধু course! লিখে missing case উপেক্ষা করবে",
        "course-কে any বানিয়ে ফেলবে",
        "course না থাকলে return বা notFound করে বাকি branch-এ title পড়বে",
        "সবসময় ধরে নেবে find প্রথম item দেয়",
      ],
      correctOption: 2,
      explanation:
        "find-এর result undefined হতে পারে। Missing case-এ return বা notFound করলে বাকি branch-এ object আছে বলে TypeScript নিশ্চিত হতে পারে, আর বাস্তব missing case-ও সামলানো হয়।",
    },
    {
      id: "typescript-narrowing-unknown-string",
      prompt:
        "value-এর type unknown। নিরাপদে value.trim() চালাতে প্রথমে কোন check দরকার?",
      options: [
        'typeof value === "string"',
        "value as string লিখলেই runtime check হয়ে যায়",
        "শুধু value !== 0",
        "কোনো check ছাড়া trim() call করা",
      ],
      correctOption: 0,
      explanation:
        "typeof check string branch-এ value-এর type narrow করে। Type assertion runtime check করে না, তাই unknown data-এর প্রকৃত type আগে যাচাই করতে হবে।",
    },
    {
      id: "typescript-narrowing-precise-status",
      prompt:
        "একটি request যেন একই সঙ্গে loading ও success হিসেবে না থাকে। কোন model lesson-এর পরামর্শের সঙ্গে মেলে?",
      options: [
        "আলাদা isLoading ও isSuccess সবসময় true রাখা",
        "প্রতিটি component-এ আলাদা random status রাখা",
        "Status-এর সব type any করা",
        "loading, success ও error-এর স্পষ্ট status union ব্যবহার করা",
      ],
      correctOption: 3,
      explanation:
        "আলাদা boolean থেকে অসম্ভব combination তৈরি হতে পারে। Status union দিয়ে branch পরিষ্কার থাকে, আর success data কেবল success branch-এর সঙ্গে রাখা যায়।",
    },
  ],
  "typescript-generics": [
    {
      id: "typescript-generics-generic-return",
      prompt:
        "first<T>(items: T[]): T | undefined function-এ string array দিলে result-এর type কী হবে?",
      options: [
        "সবসময় number",
        "string | undefined",
        "Input যা-ই হোক, any",
        "শুধু string; empty array-এর কোনো প্রভাব নেই",
      ],
      correctOption: 1,
      explanation:
        "T input থেকে string হিসেবে infer হয়। Empty array হলে প্রথম item থাকে না, তাই return type-এ undefined-ও থাকে।",
    },
    {
      id: "typescript-generics-generic-constraint",
      prompt:
        "findById-এর শুধু প্রতিটি item-এর string id দরকার, কিন্তু output-এ পুরো item-এর type রাখতে চাও। কোন constraint উপযুক্ত?",
      options: [
        "T extends number",
        "items: any[]; output-এর type-ও any",
        "T extends { id: string }",
        "T extends { title: number }; id-এর কোনো শর্ত নেই",
      ],
      correctOption: 2,
      explanation:
        "{ id: string } constraint function-এর প্রয়োজনটুকু নিশ্চিত করে। T বজায় থাকায় Course দিলে Course, Task দিলে Task-এর type output-এ থাকে।",
    },
    {
      id: "typescript-generics-useful-abstraction",
      prompt:
        "একটি সহজ logic এক জায়গায় আছে। Generic utility বানানো নিয়ে lesson-এর পরামর্শ কী?",
      options: [
        "একই pattern বাস্তবে বারবার এলে abstraction করো; শুধু generic করার জন্য করো না",
        "প্রতিটি function-এ অন্তত পাঁচটি type parameter লাগবে",
        "Generic ব্যবহার করলে সব runtime validation বাদ দেওয়া যাবে",
        "Input-output type সম্পর্ক রাখতে any ব্যবহার করাই যথেষ্ট",
      ],
      correctOption: 0,
      explanation:
        "Generic-এর উদ্দেশ্য useful reusable logic-এর type সম্পর্ক ধরে রাখা। প্রয়োজনহীন abstraction বোঝার খরচ বাড়ায়; স্পষ্ট pattern পুনরাবৃত্তি হলে এটি বেশি কাজে লাগে।",
    },
  ],
  "typescript-validation": [
    {
      id: "typescript-validation-cast-is-not-validation",
      prompt:
        "JSON.parse(raw) as Profile লিখলে বাইরের data নিয়ে কোন কথাটি সত্য?",
      options: [
        "সব missing field নিজে থেকে তৈরি হয়",
        "name number থাকলে সেটি string হয়ে যায়",
        "Invalid JSON parse error আর হতে পারে না",
        "Type assertion runtime shape validate করে না",
      ],
      correctOption: 3,
      explanation:
        "as Profile compiler-কে একটি type বিশ্বাস করতে বলে। Actual value বদলায় না বা check হয় না; বাইরের data schema দিয়ে runtime-এ validate করতে হবে।",
    },
    {
      id: "typescript-validation-safeparse-result",
      prompt:
        "ProfileSchema.safeParse(input)-এর result.success true হলে validated data কোথায় পাওয়া যায়?",
      options: [
        "Original input সবসময় নিজে থেকেই বদলে যায়",
        "result.data-তে",
        "result.error-এ",
        "Schema শুধু boolean দেয়, data দেয় না",
      ],
      correctOption: 1,
      explanation:
        "safeParse success field-সহ result দেয়। Success branch-এর result.data হলো schema দিয়ে validated ও typed value; failure branch-এ error feedback দেওয়া যায়।",
    },
    {
      id: "typescript-validation-server-validation",
      prompt:
        "Form-এর browser validation পাস করেছে। Server-এ data save করার আগে আবার validation দরকার কেন?",
      options: [
        "Browser validation database নিজে থেকে তৈরি করে",
        "TypeScript থাকলে যেকোনো HTTP input valid হয়",
        "Browser form পাশ কাটিয়ে সরাসরি HTTP request করা যায়",
        "একই schema দুবার ব্যবহার করলে সব request ব্যর্থ হয়",
      ],
      correctOption: 2,
      explanation:
        "UI validation দ্রুত feedback দেয়, কিন্তু server সরাসরি request-ও পেতে পারে। তাই mutation-এর boundary-তে input আবার validate করতে হয়; database যোগ করলে authorization-ও প্রয়োজন।",
    },
  ],
  "fullstack-architecture": [
    {
      id: "fullstack-architecture-feature-location",
      prompt:
        "Course catalog-এর filtering ও card-এর মতো সম্পর্কিত code কোথায় রাখলে project structure অনুসরণ করা হয়?",
      options: [
        "সব code root layout.tsx-এ রাখা",
        "features/courses-এ কাছাকাছি রাখা, route file-এ routing ও metadata রাখা",
        "সব course code public folder-এ রাখা",
        "প্রতিটি route-এ একই code copy করা",
      ],
      correctOption: 1,
      explanation:
        "Feature অনুযায়ী code সাজালে একই কাজের প্রাসঙ্গিক files কাছাকাছি থাকে। app folder framework-এর route convention ও metadata সামলায়; shared UI আলাদা থাকে।",
    },
    {
      id: "fullstack-architecture-reader-data-flow",
      prompt:
        "এই app-এর course reader থেকে dashboard progress বদলানোর সঠিক data flow কোনটি?",
      options: [
        "Dashboard নিজের আলাদা hardcoded count বাড়ায়",
        "Reader শুধু heading-এর text বদলায়",
        "Course title বদলালেই সব lesson complete হয়",
        "Reader action workspace state বদলায়; dashboard সেই state থেকে progress হিসাব করে",
      ],
      correctOption: 3,
      explanation:
        "State কোথায় বদলায় এবং কোথা থেকে পড়া হয় তা স্পষ্ট থাকলে bug খোঁজা সহজ। Reader-এর action ও dashboard-এর derived progress একই workspace state ব্যবহার করে।",
    },
    {
      id: "fullstack-architecture-single-data-source",
      prompt: "API, card ও reader-এ একই course title দেখাতে কোন design ভালো?",
      options: [
        "একটি shared typed data source থেকে প্রয়োজনীয় অংশ নেওয়া",
        "তিন জায়গায় title লিখে আলাদা করে update করা",
        "API-তে title বাদ দিয়ে পুরো UI code পাঠানো",
        "প্রতিবার render-এ title random করা",
      ],
      correctOption: 0,
      explanation:
        "একটি source of truth থাকলে title বদলানোর জন্য এক জায়গায় edit করলেই হয়। API নিজের summary নিতে পারে, আর reader lesson content নিতে পারে।",
    },
  ],
  "fullstack-api-design": [
    {
      id: "fullstack-api-design-read-only-get",
      prompt: "GET /api/courses?q=react endpoint-এর কাজ কোনটি হওয়া উচিত?",
      options: [
        "Search করার সঙ্গে সঙ্গে user-এর progress বদলানো",
        "সব matching course completed করে দেওয়া",
        "Query অনুযায়ী course summary list পড়ে ফেরানো",
        "প্রতিটি request-এ একটি user account তৈরি করা",
      ],
      correctOption: 2,
      explanation:
        "GET request data পড়ার জন্য। এই API query অনুযায়ী summary list দেয়; user progress বদলানো বা account তৈরি করা এর কাজ নয়।",
    },
    {
      id: "fullstack-api-design-empty-search-status",
      prompt:
        "Search request valid, কিন্তু কোনো course মেলেনি। কোন response উপযুক্ত?",
      options: [
        "200 status, empty courses array এবং total: 0",
        "500 status, কারণ match না পাওয়া server crash",
        "404 status, কারণ সব empty search-ই missing resource",
        "200 status, কিন্তু পুরোনো unrelated result-কে matching বলা",
      ],
      correctOption: 0,
      explanation:
        "Valid search-এ শূন্য result-ও সফল response। Empty collection search আর নির্দিষ্ট একটি resource না-পাওয়া এক ঘটনা নয়; missing individual resource-এর জন্য 404 উপযুক্ত।",
    },
    {
      id: "fullstack-api-design-api-demo-boundary",
      prompt: "এই demo-র API ও progress persistence সম্পর্কে কোন কথাটি সঠিক?",
      options: [
        "Course API-তেই user account ও progress database আছে",
        "GET /api/courses-এ request করলেই সব device sync হয়",
        "localStorage থাকলেই server authorization সম্পন্ন",
        "Course API read-only; progress browser storage-এ থাকে",
      ],
      correctOption: 3,
      explanation:
        "Demo-র read-only API course summaries দেয়। Account ও progress database নেই; backend যোগ করলে identity, authorization, persistence ও validation একসঙ্গে design করতে হবে।",
    },
  ],
  "fullstack-reliability": [
    {
      id: "fullstack-reliability-valid-progress-invariant",
      prompt:
        "Stored completed IDs-এ একটি unknown lesson ID আছে। Visible course progress কীভাবে হিসাব করবে?",
      options: [
        "Stored সব ID count করে percentage বাড়াবে",
        "Course-এর প্রকৃত lesson list-এর সঙ্গে matching completed IDs count করবে",
        "Unknown ID থাকলেই course-কে 100% complete দেখাবে",
        "Unknown ID-কে নতুন lesson ধরে নেবে",
      ],
      correctOption: 1,
      explanation:
        "Invariant অনুযায়ী unknown ID visible progress বাড়াবে না। Course-এর lesson list ধরে completed IDs মেলালে শুধু valid lesson count হয় এবং progress অর্থপূর্ণ থাকে।",
    },
    {
      id: "fullstack-reliability-storage-write-failure",
      prompt:
        "Storage write ব্যর্থ হয়েছে, কিন্তু in-memory state ব্যবহার করা যাচ্ছে। UI-এর কী করা উচিত?",
      options: [
        "সব data স্থায়ীভাবে save হয়েছে বলা",
        "কোনো কারণ না জানিয়ে পুরো app বন্ধ রাখা",
        "App usable রাখা এবং পরিবর্তন save হয়নি বলে user-কে জানানো",
        "Failure লুকাতে progress 100% দেখানো",
      ],
      correctOption: 2,
      explanation:
        "Storage unavailable হলেও app-এর কাজ যতটা সম্ভব চালু রাখা যায়। তবে user-কে save failure জানাতে হবে, কারণ in-memory পরিবর্তন refresh-এর পরে হারাতে পারে।",
    },
    {
      id: "fullstack-reliability-journey-test",
      prompt:
        "Lesson completion persistence পরীক্ষা করতে কোন test journey সবচেয়ে প্রাসঙ্গিক?",
      options: [
        "Lesson complete → dashboard progress দেখা → refresh → একই progress যাচাই",
        "শুধু button-এর text পড়ে test শেষ করা",
        "শুধু course title-এর spelling পরীক্ষা করা",
        "শুধু একটি screenshot নিয়ে storage ঠিক ধরে নেওয়া",
      ],
      correctOption: 0,
      explanation:
        "এই journey action, shared state, derived progress ও refresh-এর পরে persistence একসঙ্গে যাচাই করে। শুধু button বা screenshot দেখে saved state সঠিক কি না নিশ্চিত হওয়া যায় না।",
    },
  ],
  "fullstack-shipping": [
    {
      id: "fullstack-shipping-checks-have-limits",
      prompt:
        "Typecheck, lint ও production build সব পাস করেছে। কোন সিদ্ধান্তটি যুক্তিসংগত?",
      options: [
        "এখন app-এ কোনো bug থাকার সম্ভাবনা নেই",
        "User flow ও mobile checks আর দরকার নেই",
        "Typecheck-ই সব runtime request validate করেছে",
        "আলাদা ধরনের code checks পাস হয়েছে; গুরুত্বপূর্ণ user journey-ও পরীক্ষা করতে হবে",
      ],
      correctOption: 3,
      explanation:
        "প্রতিটি check আলাদা problem ধরতে সাহায্য করে; কোনোটিই bug-free হওয়ার নিশ্চয়তা নয়। ব্যবহারযোগ্যতা, persistence ও navigation বাস্তব journey দিয়ে পরীক্ষা করতে হয়।",
    },
    {
      id: "fullstack-shipping-experience-review",
      prompt:
        "Project share করার আগে experience যাচাইয়ের জন্য কোন তালিকাটি উপযুক্ত?",
      options: [
        "শুধু বড় desktop screen-এ homepage দেখা",
        "Mobile viewport, keyboard, back button, form error, empty search ও direct route দেখা",
        "শুধু code-এর line count মাপা",
        "সব error message লুকিয়ে happy path দেখা",
      ],
      correctOption: 1,
      explanation:
        "User বিভিন্ন viewport ও navigation পদ্ধতি ব্যবহার করে এবং error বা empty state-এ পৌঁছায়। Direct route ও refresh-ও পরীক্ষা করলে development-এর বাইরের ব্যবহার বোঝা যায়।",
    },
    {
      id: "fullstack-shipping-honest-handoff",
      prompt:
        "এই learning project-এর README-তে কোন তথ্যটি স্পষ্টভাবে লেখা দরকার?",
      options: [
        "Feature না থাকলেও authentication ও database আছে বলা",
        "শুধু project-এর নাম, setup-এর কোনো ধাপ নয়",
        "Setup, route-to-feature structure, browser-local persistence ও সীমাবদ্ধতা",
        "সব checks পাস মানেই production-এর সব প্রয়োজন পূরণ হয়েছে বলা",
      ],
      correctOption: 2,
      explanation:
        "ভালো handoff পড়ে অন্য developer app চালাতে ও feature-এর code খুঁজতে পারে। Data কোথায় থাকে এবং demo-তে কী নেই তা পরিষ্কারভাবে জানানো documentation-এর অংশ।",
    },
  ],
};
