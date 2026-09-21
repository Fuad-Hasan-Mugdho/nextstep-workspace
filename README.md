# NextStep — ব্যবহার করতে করতে Next.js শিখুন

NextStep একটি ব্যক্তিগত coding learning workspace। বাংলায় lesson পড়ুন, অগ্রগতি রাখুন, নিজের note লিখুন এবং focus session চালান। একই সঙ্গে project-এর code খুলে দেখুন একটি বাস্তব Next.js application কীভাবে কাজ করে।

এটি **শেখার জন্য তৈরি কার্যকর demo**। ব্যক্তিগত workspace data আপনার browser-এ থাকে; authentication, database বা email delivery যুক্ত নেই। কোনো project-কে শুধু দেখে “১০০/১০০” বলা যায় না—কোন check কী যাচাই করে এবং কী সীমা আছে, নিচে তা স্পষ্ট করা হয়েছে।

## শুরু করুন

Node.js **20.9 বা পরের version** এবং npm লাগবে। Dependencies-এর নির্দিষ্ট resolved version `package-lock.json`-এ আছে।

NVM ব্যবহার করলে project folder-এ প্রথমে `nvm use` চালান। [.nvmrc](.nvmrc) installed Node 20 নির্বাচন করে; version installed না থাকলে `nvm install` চালান। নতুন terminal-এ Node 18 default থাকলে এই ধাপটি দরকার—Node 18 দিয়ে এই project-এর Next.js বা Playwright চালানো যাবে না।

```bash
git clone https://github.com/Fuad-Hasan-Mugdho/nextstep-workspace.git
cd nextstep-workspace
npm ci
npm run dev
```

Browser-এ [localhost:3000](http://localhost:3000) খুলুন। Port ব্যস্ত থাকলে terminal-এ দেখানো URL ব্যবহার করুন। অন্য port চাইলে:

```bash
npm run dev -- --port 3001
```

**কোনো API key, login বা `.env.local` বাধ্যতামূলক নয়।** `NEXT_PUBLIC_APP_URL` না দিলে default হলো `http://localhost:3000`। Deploy করার সময় প্রয়োজনে `.env.example` দেখে নিজের public URL দিন। `NEXT_PUBLIC_` variable browser-এ প্রকাশ পেতে পারে; secret রাখার জায়গা এটি নয়।

## প্রথম ১০ মিনিটে কী করবেন

1. **Dashboard** থেকে Courses খুলে “Next.js Fundamentals” শুরু করুন।
2. একটি lesson পড়ে complete করুন। Dashboard-এ progress বদলানো দেখুন।
3. **My Notes**-এ নিজের ভাষায় দুই line লিখে save করুন। Refresh দিয়ে note থাকছে কি না দেখুন।
4. **Roadmap**-এ আপনার শেখার ধাপ দেখুন, পরের অনুশীলনটি task হিসেবে যোগ করুন।
5. **Focus Room**-এ timer চালিয়ে pause/resume চেষ্টা করুন।
6. **Settings** থেকে নাম ও weekly goal বদলান, JSON export করুন।
7. **Project tour** এবং **Server Action playground** খুলে interface-এর পেছনের code বুঝুন।

এবার [বাংলা learning guide](docs/LEARNING_GUIDE.bn.md) ধরে একটি feature বদলান।

## কী তৈরি হয়েছে

| Feature         | ব্যবহার করে যা করতে পারবেন                                        | যে concept শেখায়                                   |
| --------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| Dashboard       | নিজের progress, weekly activity, next lesson ও focus history দেখা | Derived state, reusable component                   |
| Course catalog  | Search/filter, course শুরু, bookmark                              | Typed data, event handler, filtering                |
| Lesson reader   | বাংলায় ব্যাখ্যা, code example, challenge এবং completion          | Dynamic route, async params, server/client boundary |
| Roadmap         | Course অনুযায়ী অগ্রগতি, নিজের task যোগ/complete/delete           | Shared state, immutable update                      |
| Notes           | Create/edit/delete, search, tag filter, draft                     | Form state, CRUD, local persistence                 |
| Focus Room      | Work/break timer, pause/resume/reset, completed session history   | Effects, time calculations, browser state           |
| Settings        | Display name, weekly goal, JSON export, confirmed reset           | Runtime validation, file download                   |
| Project tour    | File structure, metadata ও data flow-এর বাংলা ব্যাখ্যা            | App Router architecture                             |
| Form playground | Real server validation, field error, pending ও success            | Server Action, FormData, Zod, useActionState        |

চারটি course-এ মোট **১৬টি lesson** আছে: Next.js Fundamentals, React Essentials, TypeScript Toolkit ও Full-stack Patterns। Course content [data.ts](src/features/courses/data.ts)-এ এক জায়গায় রাখা হয়েছে।

## Route থেকে code খুঁজুন

| URL                            | Entry point                                                    | কাজ                        |
| ------------------------------ | -------------------------------------------------------------- | -------------------------- |
| `/`                            | [app/page.tsx](src/app/page.tsx)                               | Dashboard                  |
| `/courses`                     | [app/courses/page.tsx](src/app/courses/page.tsx)               | Catalog                    |
| `/courses/nextjs-fundamentals` | [app/courses/[slug]/page.tsx](src/app/courses/[slug]/page.tsx) | Dynamic course page        |
| `/roadmap`                     | [app/roadmap/page.tsx](src/app/roadmap/page.tsx)               | Learning path ও tasks      |
| `/notes`                       | [app/notes/page.tsx](src/app/notes/page.tsx)                   | Notebook                   |
| `/focus`                       | [app/focus/page.tsx](src/app/focus/page.tsx)                   | Focus timer                |
| `/settings`                    | [app/settings/page.tsx](src/app/settings/page.tsx)             | Workspace settings         |
| `/about`                       | [app/about/page.tsx](src/app/about/page.tsx)                   | বাংলা project tour         |
| `/contact`                     | [app/contact/page.tsx](src/app/contact/page.tsx)               | Server Action playground   |
| `/api/health`                  | [app/api/health/route.ts](src/app/api/health/route.ts)         | JSON health response       |
| `/api/courses`                 | [app/api/courses/route.ts](src/app/api/courses/route.ts)       | Read-only course summaries |

Course API-তে `?q=react` এবং `?category=React` দিয়ে filter করা যায়। Unknown course URL-এ not-found page দেখানো হয়।

## Folder structure

```text
src/
├── app/                      # Next.js routing, layouts, metadata, API
│   ├── layout.tsx            # HTML document + shared application shell
│   ├── page.tsx              # Dashboard entry
│   ├── courses/[slug]/       # One route handles all courses
│   ├── error.tsx             # Unexpected render error fallback
│   ├── loading.tsx           # Loading fallback
│   └── not-found.tsx         # Missing page/course UI
├── components/
│   ├── layout/               # Sidebar, header, responsive navigation
│   └── ui/                   # Reusable icons and UI pieces
├── config/                   # Site settings + environment validation
└── features/
    ├── courses/              # Typed course content and cards
    ├── dashboard/            # Progress and activity presentation
    ├── workspace/
    │   ├── model.ts          # Zod schemas, types, initial state
    │   ├── store.ts          # Browser storage and subscriptions
    │   └── workspace-provider.tsx # useWorkspace + shared actions
    ├── notes/                # Note editor, search, draft
    ├── focus/                # Timer and sessions
    ├── settings/             # Profile, export, reset
    ├── about/                # Project tour styles
    └── contact/
        ├── schema.ts         # Form types and validation rules
        ├── actions.ts        # Code that executes on the server
        └── contact-form.tsx  # Interactive browser form
```

আরও গভীরে বুঝতে [architecture guide](docs/ARCHITECTURE.bn.md) পড়ুন। Folder-এর নাম framework-এর বাধ্যতামূলক নিয়ম নয়; `features/` ও `components/` আমাদের code গোছানোর convention। `app/`-এর special filename-গুলো Next.js convention।

## Data কোথায় থাকে

- **Course content:** repository-তে static typed data। Course progress আলাদা personal state।
- **Profile, progress, bookmarks, saved notes, tasks, completed focus sessions:** `localStorage`-এর `nextstep-workspace-v1` key-তে। একই browser profile ও একই origin-এ refresh-এর পরেও থাকে। Origin-এর মধ্যে scheme, hostname ও port-ও পড়ে।
- **Note draft ও চলমান timer:** tab-এর `sessionStorage`-এ recovery state। এগুলো saved note বা completed focus session-এর সমান নয়।
- **Form playground input:** validation-এর জন্য server-এ যায়। এই application email পাঠায় না, message log বা database-এ save করে না।
- **JSON export:** নিজের data দেখার ও backup রাখার জন্য download। Automatic import/restore UI এখন নেই।

Storage থেকে পড়া JSON-ও Zod দিয়ে যাচাই হয়। Invalid saved data পাওয়া গেলে original data preserve করে warning দেখানো হয়; Settings থেকে original export করে reset করা যায়। Storage বন্ধ বা quota পূর্ণ থাকলে app চলতে পারে, কিন্তু নতুন কাজ কেবল current visit-এ থাকতে পারে—warning অনুযায়ী export করুন।

Browser data clear করলে বা অন্য browser/device-এ গেলে স্বয়ংক্রিয়ভাবে data পাওয়া যাবে না। এটি encrypted storage, cloud sync বা multi-user account system নয়। একই origin-এর একাধিক tab sequential update দেখতে পায়; একসঙ্গে conflicting edit হলে database-এর transaction guarantees নেই।

## Command ও যাচাই

| Command                | উদ্দেশ্য                               |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Development server + live updates      |
| `npm run lint`         | ESLint দিয়ে code সমস্যা খোঁজা         |
| `npm run lint:fix`     | ESLint-এর supported automatic fixes    |
| `npm run typecheck`    | TypeScript type check                  |
| `npm run build`        | Production output তৈরি                 |
| `npm run start`        | তৈরি production build চালানো           |
| `npm run check`        | Lint → typecheck → production build    |
| `npm run format`       | Prettier দিয়ে code format             |
| `npm run format:check` | Formatting যাচাই                       |
| `npm test`             | Project-এর automated test script       |
| `npm run test:e2e`     | Playwright দিয়ে browser user journeys |

Browser tests production build ব্যবহার করে। প্রথমবার Chromium install করুন (Linux-এ Google Chrome আগে থেকে থাকলে config সেটি ব্যবহার করতে পারে):

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

Linux-এ browser system dependencies না থাকলে আপনার environment অনুযায়ী `npx playwright install --with-deps chromium` লাগতে পারে। এটি system package installation করতে পারে। এক command-এ lint, typecheck, build ও browser tests চালাতে `npm test` ব্যবহার করুন। `npm run test:e2e` নিজে build করে না। Test runner-এর server/port configuration [playwright.config.ts](playwright.config.ts)-এ দেখুন।

Production mode হাতে পরীক্ষা করতে:

```bash
npm run check
npm run start
```

Typecheck runtime input যাচাই করে না; lint UI ব্যবহার করে দেখে না; build সফল হওয়া মানে সব user journey সঠিক, তা-ও নয়। তাই browser tests ও manual review আলাদা দরকার। Automated checks-এর test case বদলালে expected behavior-ও বুঝে বদলাবেন।

শেষ review-এর ফল, সংশোধন ও পরীক্ষার সীমা আছে [যাচাই প্রতিবেদন](docs/REVIEW.bn.md)-এ।

## শেখার ক্রম

1. [app/about/page.tsx](src/app/about/page.tsx): JSX ও metadata।
2. [app/layout.tsx](src/app/layout.tsx): shared layout ও children।
3. [features/courses/data.ts](src/features/courses/data.ts): TypeScript data model।
4. [app/courses/[slug]/page.tsx](src/app/courses/[slug]/page.tsx): dynamic params, lookup, notFound।
5. [workspace model](src/features/workspace/model.ts), [actions/hook](src/features/workspace/workspace-provider.tsx), তারপর [store](src/features/workspace/store.ts): shared state ও persistence।
6. [contact schema](src/features/contact/schema.ts), [action](src/features/contact/actions.ts), [form](src/features/contact/contact-form.tsx): browser → server → UI।
7. একটি test পড়ুন, তারপর নিজে একটি ছোট feature যোগ করুন।

প্রতিটি ধাপের “কী বদলাবেন” ও “কীভাবে বুঝবেন কাজ করেছে” আছে [বাংলা learning guide](docs/LEARNING_GUIDE.bn.md)-এ।

## এই project-এর সীমা ও পরের ধাপ

Full-stack Patterns একটি course-এর নাম; app-এ এখনো production database, user authentication, authorization, email provider, rate limiting বা multi-device synchronization তৈরি নেই। সেগুলো যোগ করতে data ownership, server-side access control, migrations, backups এবং integration tests আলাদা করে design করতে হবে।

Timer শেখার সহায়ক। Browser/OS background scheduling এবং বন্ধ tab-এর সীমা আছে; এটি background notification service নয়। Dashboard-এর progress আপনার নিজের complete action-এর ভিত্তিতে হিসাব হয়, জ্ঞান যাচাই করে certificate দেয় না।

Installed stack: Next.js 16.3.5, React 19.2.8, TypeScript, Zod ও Playwright। Next.js APIs বদলাতে পারে—এই repository-তে code বদলানোর আগে [AGENTS.md](AGENTS.md) এবং `node_modules/next/dist/docs/`-এর প্রাসঙ্গিক guide পড়ুন।
