# NextStep architecture

এই নকশায় routing, feature logic এবং browser persistence-এর দায়িত্ব আলাদা রাখা হয়েছে। এতে একটি button-এর কাজ বোঝার জন্য পুরো project পড়তে হয় না।

## তিনটি data flow

### Course content: repository → page → reader

```text
features/courses/data.ts
  ├── Catalog/cards
  ├── Dynamic course Server Component
  │     └── Interactive course reader
  └── Read-only course API summaries
```

Content static এবং typed। Course page URL-এর slug পড়ে course খুঁজে পায়। Missing course-এ `notFound()`। Client reader serializable course data নিয়ে lesson selection ও completion interaction দেখায়। Lesson body fetch করার জন্য database বা third-party service লাগে না।

### Personal workspace: event → action → store → subscribers

```text
User clicks “complete”
  → completeLesson(id)
  → updateWorkspace(current => next)
  → validate next state
  → save browser JSON when storage is usable
  → notify subscribed components
  → Dashboard, reader ও roadmap নতুন হিসাব দেখায়
```

Store হলো একটি module-level external store। `WorkspaceProvider` নাম থাকলেও এখানে global value React Context-এ রাখা হয়নি; `useWorkspace()`-এর `useSyncExternalStore` দিয়ে subscription হয়। Wrapper storage warning দেখায়।

`model.ts` shared shape জানে। `store.ts` persistence ও subscription জানে। `workspace-provider.tsx` user actions জানে। UI action call করে; আলাদা page নিজের মতো localStorage JSON overwrite করে না।

### Form: browser → server → action result

```text
contact/page.tsx (Server Component + metadata)
  → contact-form.tsx (Client Component)
  → formAction / POST
  → actions.ts (Server Function)
  → schema.safeParse(FormData fields)
  → serializable error/success result
  → useActionState updates UI
```

Server Action-এর জন্য আলাদা `/api/contact` route নেই। React/Next.js form action-এর transport সামলায়। এটি validation-only public demo; কোনো protected data mutation নেই।

## Rendering ও browser APIs

Server Component-এর code browser bundle-এ পাঠাতে হয় না। Client Component-এ state/effect/event handler ব্যবহার করা যায়, তবে প্রথম render server-এর HTML-এ থাকতে পারে। তাই `"use client"` লেখার পরেই render-এর মধ্যে `window.localStorage` পড়া নিরাপদ হয়ে যায় না।

Workspace-এর server snapshot এবং প্রথম hydration snapshot মেলে। Subscription-এর পরে browser storage পড়ে UI update হয়। Notes-এর editor browser hydration-এর পরে mount হয়, তখন tab-local draft পড়া যায়।

Root layout shared shell-এ server-rendered children pass করে। Client shell দিয়ে wrap করা মানেই তার children হিসেবে পাওয়া সব Server Component client code হয়ে যায় না; import boundary-ও বিবেচনা করতে হয়।

## Persistence এবং failure behavior

| পরিস্থিতি                                 | আচরণ                                                            |
| ----------------------------------------- | --------------------------------------------------------------- |
| প্রথম visit                               | Empty initial workspace                                         |
| Valid saved JSON                          | Schema validate করে restore                                     |
| Invalid JSON বা unsupported shape/version | Original data preserve, warning, export/reset recovery          |
| Browser storage read/write unavailable    | Memory-তে কাজ চলতে পারে; persistence warning                    |
| Same-origin অন্য tab-এ saved update       | Storage event দিয়ে current state refresh                       |
| Settings reset                            | Confirmed reset of workspace এবং current tab-এর transient state |
| Export                                    | JSON download; automatic import UI নেই                          |

`version` ভবিষ্যৎ schema migration-এর সুযোগ রাখে, কিন্তু arbitrary পুরোনো/new format convert করার universal migration system নয়। একাধিক tab একই সময়ে edit করলে last write অন্য edit ছাপিয়ে যেতে পারে। Server transaction, conflict resolution ও cloud sync এই demo-তে নেই।

Saved notes ও completed sessions workspace data। Unfinished draft ও active timer tab-local transient state। Tab বন্ধ করা, browser storage policy এবং অন্য device ব্যবহারের ক্ষেত্রে এই পার্থক্য জরুরি।

## Validation কোথায়

TypeScript editor/build-time সাহায্য দেয়। Browser বা network থেকে আসা runtime value-কে TypeScript type annotation নিজে validate করে না। তাই stored JSON, form fields ও profile settings-এ schema validation আছে।

Workspace actions immutable update করে। Repeated lesson completion duplicate ID যোগ করে না। UI progress course-এর valid lesson IDs-এর সঙ্গে saved state মিলিয়ে হিসাব করা উচিত; arbitrary stored IDs count বাড়াতে পারে না।

Contact schema string trim করে এবং bounds দেয়। Failed action normal input values ফেরত দেয়, যাতে user সংশোধন করতে পারে। Success response email sent হওয়ার দাবি করে না। Real email/DB mutation যোগ করলে server action-এর boundary-তেই validation, authorization ও delivery failure handling লাগবে।

## UI conventions

Shared application styles `src/app/globals.css`-এ; notes, contact এবং tour-এর feature-specific styles সংশ্লিষ্ট feature-এ। Shared `.panel`, `.button`, `.page-heading`, `.form-field` class-গুলো visual consistency রাখে। Responsive navigation ও layout ছোট screen-এ content accessible রাখে।

Icon হলো reusable SVG component; decorative SVG screen reader থেকে hidden। Real buttons actions চালায়, `next/link` navigation করে, inputs-এর labels থাকে এবং feedback live region/status দিয়ে ঘোষণা করা যায়।

## এই architecture কখন বাড়াতে হবে

একাধিক user/device-এ স্থায়ী data লাগলে browser store-এর জায়গায় server persistence এবং identity দরকার। তখন শুরুতে user-owned record model, server validation, authorization, database migrations এবং failure/retry behavior নির্ধারণ করুন। Shared UI এবং typed feature boundaries সেই পরিবর্তনের কাজ আলাদা করে বুঝতে সাহায্য করবে।

Project বর্তমানে Next.js Server Components, Route Handlers ও Server Actions ব্যবহার করে। এগুলো framework capability-এর বাস্তব উদাহরণ; production SaaS infrastructure সম্পূর্ণ হয়েছে, এমন দাবি নয়।
