# NextStep-এর code বোঝার বাংলা guide

প্রথমে project চালু করুন। Code না বদলে একটি lesson complete, একটি note save এবং একটি form submit করুন। আপনি যে behavior দেখলেন, এবার তার code খুঁজবেন। একবারে একটি exercise করুন; প্রতিটি change-এর পরে browser আর terminal দেখুন।

## ১. আপনার metadata line বুঝুন

আপনার আগের code ছিল:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Project সম্পর্কে" };
```

| অংশ              | অর্থ                                                           |
| ---------------- | -------------------------------------------------------------- |
| `import type`    | শুধু TypeScript-এর type আনে; browser-এ চালানোর function আনে না |
| `Metadata`       | Next.js metadata object-এর expected shape                      |
| `export`         | Next.js-কে এই named value পড়তে দেয়                           |
| `const metadata` | Object-এর নাম `metadata`; convention অনুযায়ী Next.js এটি পড়ে |
| `: Metadata`     | Editor/compiler-কে object-এর type জানায়                       |
| `title`          | Browser tab ও document-এর title                                |

বর্তমান about page-এ title `Project tour`। Root layout-এর `title.template` হলো `%s | NextStep`; তাই about page-এর tab title হয় `Project tour | NextStep`। দৃশ্যমান heading আলাদা JSX-এর `<h1>`।

**অনুশীলন:** `src/app/about/page.tsx`-এ metadata title `আমার শেখার খাতা` করুন। Browser tab ও page-এর বড় heading দেখুন। Tab বদলাবে, heading নিজে থেকে বদলাবে না। এবার heading-ও আলাদা করে বদলান।

**যাচাই:** `/about` সরাসরি খুলুন এবং refresh করুন। `npm run typecheck` চালান। Metadata export-এর page-এ `"use client"` যোগ করবেন না; state দরকার হলে আলাদা component বানান।

## ২. Folder থেকে route বানান

`src/app/hello/page.tsx` তৈরি করুন:

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "আমার প্রথম নতুন page" };

export default function HelloPage() {
  return (
    <section className="panel">
      <h1>হ্যালো, Next.js!</h1>
      <p>আমি folder দিয়ে একটি route বানালাম।</p>
      <Link className="button button-secondary" href="/courses">
        Courses-এ যাই
      </Link>
    </section>
  );
}
```

`/hello` খুলুন। Root layout থাকার কারণে shared sidebar/header নিজে থেকে থাকবে। `page.tsx` ছাড়া শুধু folder তৈরি করলে visible page তৈরি হয় না।

**যাচাই:** URL সরাসরি খুলুন, Link-এ click করুন, browser back ব্যবহার করুন। Link click-এর জন্য `onClick` দরকার হয়নি—navigation-এর জন্য semantic link যথেষ্ট।

## ৩. Server ও Client আলাদা করুন

App Router-এর page/layout default Server Component। এগুলো server-এ UI তৈরি করে। `onClick`, `useState` বা browser API লাগলে `"use client"` boundary লাগে। Client Component প্রথম load-এ server-rendered HTML-ও পেতে পারে; “client” মানে সবসময় browser-এই প্রথম render হবে, এমন নয়।

নতুন `src/features/hello/counter.tsx` বানান:

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      className="button button-primary"
      onClick={() => setCount((previous) => previous + 1)}
    >
      অনুশীলন করেছি: {count}
    </button>
  );
}
```

Hello page-এ import করে `<Counter />` বসান। Page-এর metadata থাকবে server-এ; button-এর state থাকবে interactive component-এ।

**যাচাই:** Click-এ count বাড়ে। Refresh-এ zero হয়—কারণ এখন শুধু memory state। Workspace-এর persistence পরের exercise-এ বুঝবেন।

## ৪. একটি lesson-এর data অনুসরণ করুন

`src/features/courses/data.ts`-এ `Course` ও `Lesson` type পড়ুন। একটি lesson-এর `intro` নিজের ভাষায় বদলান। তারপর সংশ্লিষ্ট course খুলুন।

একটি নতুন lesson যোগ করতে existing object-এর shape অনুসরণ করুন। একটি **unique, stable `id`**, title, duration, intro, sections, challenge ও takeaway দিন। Course-এর total minutes-ও প্রয়োজনে মিলিয়ে নিন। আগে complete করা lesson-এর id বদলালে saved progress পুরোনো id-তেই থাকবে।

**Code পড়ার পথ:**

```text
courses/data.ts
  → app/courses/[slug]/page.tsx
  → course-reader.tsx
  → completeLesson(lesson.id)
  → workspace/store.ts
  → dashboard নতুন progress দেখায়
```

Dynamic page-এর `params` Promise, তাই `await params` ব্যবহার হয়েছে। Unknown slug-এর জন্য `notFound()` আছে। একটি route file সব course দেখাতে পারে, কারণ data আলাদা।

**যাচাই:** Lesson complete করুন, অন্য route-এ যান, refresh করুন। একই lesson আবার complete করলে total count বাড়া উচিত নয়। `/courses/does-not-exist`-এ not-found UI হওয়া উচিত।

## ৫. State, derived value ও storage

তিনটি file এই ক্রমে পড়ুন:

1. `model.ts`: State-এর shape, validation rules ও initial values।
2. `workspace-provider.tsx`: `completeLesson`, `addNote`, `toggleTask`-এর মতো কাজ এবং `useWorkspace` hook।
3. `store.ts`: State কোথায় থাকে, subscriber কীভাবে update পায়, storage read/write কীভাবে হয়।

`useSyncExternalStore` React-কে বাইরের store-এর সঙ্গে sync করে। `getServerSnapshot` predictable initial UI দেয়; browser hydrate করার পরে saved state পাওয়া যায়। Store change হলে subscribed component আবার render হয়।

**Derived value** হলো existing state থেকে হিসাব করা value। Completed count আলাদা করে edit না করে valid lesson IDs ও completed IDs মিলিয়ে count করা হয়। ফলে একই তথ্যের দুইটি copy sync করতে হয় না।

`localStorage` string রাখে। `JSON.stringify` object-কে string বানায়; `JSON.parse` তা ফেরত আনে। Parse successful হওয়া মানে data-এর shape সঠিক নয়, তাই Zod validation দরকার।

**অনুশীলন:** Settings থেকে নাম বদলে dashboard দেখুন। DevTools → Application → Local Storage-এ `nextstep-workspace-v1` খুঁজে শুধু পড়ুন। একটি note save করে JSON বদলানো দেখুন। তারপর JSON export করুন।

**যাচাই:** একই origin-এ refresh করলে data থাকে। অন্য browser profile-এ থাকে না। ব্যক্তিগত note রেখে DevTools-এ storage clear করবেন না; reset feature-তে confirmation আছে।

## ৬. Form browser থেকে server-এ যায় কীভাবে

এই feature মাত্র তিনটি প্রধান file:

| File                                | দায়িত্ব                                    |
| ----------------------------------- | ------------------------------------------- |
| `features/contact/schema.ts`        | Valid input-এর নিয়ম, types ও initial state |
| `features/contact/actions.ts`       | Server-এ FormData পড়ে Zod validation       |
| `features/contact/contact-form.tsx` | Input, pending, error এবং success UI        |

`useActionState` তিনটি value দেয়:

```tsx
const [state, formAction, pending] = useActionState(
  validateContactDemo,
  initialContactState,
);
```

- `state`: Action-এর returned result।
- `formAction`: `<form action={formAction}>`-এ দেওয়া function।
- `pending`: Request চলছে কি না; submit button তখন disabled।

Hook ব্যবহার করলে action-এর প্রথম argument আগের state এবং দ্বিতীয় argument FormData। Input-এর `name="email"` থেকেই server `formData.get("email")` দিয়ে value পায়। `id` মূলত label/accessibility-র জন্য; FormData key হলো `name`।

Browser-এর `required` বা `type="email"` দ্রুত feedback দেয়। এগুলো direct HTTP request ঠেকায় না। Server schema-তে trim, minimum ও maximum length আবার যাচাই হয়। Public demo action কোনো protected resource পড়ে/বদলায় না; account-specific কাজ যোগ করলে action-এর ভেতরে authentication এবং authorization লাগবে।

**দুটি case চেষ্টা করুন:**

1. `Alex Rahman`, `alex@example.com`, `I learned how server validation works.` দিয়ে submit করুন। Success result-এ স্পষ্টভাবে লেখা থাকবে email পাঠানো বা message save করা হয়নি।
2. Name-এ দুইটি space এবং message-এ দশটি space দিন, email valid রাখুন। Browser-এর সাধারণ required checks পার হলেও server trim করার পরে field error দেখাবে। Valid লেখা দিয়ে আবার submit করুন।

**অনুশীলন — Subject যোগ করুন:**

1. `schema.ts`-এর object-এ `subject: z.string().trim().min(3).max(120)` যোগ করুন। Inferred type নিজে আপডেট হবে।
2. `actions.ts`-এর `rawFields`-এ `subject: formData.get("subject")` যোগ করুন।
3. Error response-এর `values` object-এ bounded subject string দিন।
4. Form-এ label-সহ `name="subject"` input দিন; required, minLength, maxLength, defaultValue, aria-invalid এবং error text অন্য field-এর মতো রাখুন।
5. Valid ও whitespace-only subject পরীক্ষা করুন। `npm run typecheck` ও `npm run lint` চালান।

TypeScript কোথাও missing property ধরলে সেটি সাহায্য: নতুন field যোগ করলে কোন কোন boundary বদলাতে হবে তা দেখাচ্ছে।

## ৭. একটি bug report থেকে test ভাবুন

ধরুন report: “Note লিখে courses-এ গেলাম, ফিরে এসে লেখা হারিয়ে গেছে।”

প্রথমে আচরণ লিখুন: unfinished note tab-local draft হিসেবে থাকে; Save চাপলে workspace note হয়। এরপর journey test করুন: new note → type → courses → notes → draft দেখা → Save → reload → saved note দেখা। শুধু textarea-তে type হয়েছে কি না দেখলে মূল bug ধরা পড়ে না।

একইভাবে completion test-এ complete → dashboard → reload → একই count দেখতে হবে। Form test-এ invalid → field errors → corrected submit → honest success দেখতে হবে। Playwright tests এই ধরনের ব্যবহারকারীর journey automation করে।

## ৮. নিজে শেষ করার ছোট checklist

- নতুন page সরাসরি URL থেকে খোলে?
- Keyboard Tab দিয়ে field ও button ব্যবহার করা যায়?
- Empty search-এ বোঝা যায় এমন feedback আছে?
- Invalid form ঠিক করে আবার submit করা যায়?
- Save-এর পরে refresh করলে data থাকে?
- Mobile width-এ পুরো page পাশের দিকে scroll করতে হচ্ছে না?
- `npm run check` ও প্রাসঙ্গিক tests pass করছে?
- README-তে feature-এর সত্যিকারের behavior লেখা আছে?

সব code একবারে মুখস্থ করার দরকার নেই। প্রতিটি feature-এর “input → state/validation → output” নিজে ব্যাখ্যা করতে পারলে বোঝার ভিত্তি তৈরি হবে।
