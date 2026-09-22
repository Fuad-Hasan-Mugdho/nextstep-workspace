# NextStep — যাচাই প্রতিবেদন

শেষ review: **২২ সেপ্টেম্বর ২০২৬**। Lesson quiz-সহ বর্তমান demo scope-এর implementation ও review শেষ হয়েছে। ২১ সেপ্টেম্বরের production build ও সম্পূর্ণ test report যাচাই করে নিচের ফল লেখা হয়েছে। এটি bug-free হওয়ার বা “১০০/১০০” quality score-এর নিশ্চয়তা নয়।

## কী সম্পূর্ণ হয়েছে

Dashboard, চারটি course-এর ১৬টি বাংলা lesson, search/filter/bookmark, lesson progress, notes CRUD, roadmap tasks, focus timer, settings/export/reset এবং Server Action form playground কাজ করছে। প্রতিটি lesson-এ তিনটি করে মোট **৪৮টি quiz question**, score, সঠিক উত্তর, বাংলা explanation ও retry যোগ হয়েছে। সর্বশেষ score, best score ও attempt count browser-এ save থাকে এবং export/reset-এর অন্তর্ভুক্ত। বাংলা architecture ও learning guide-ও update হয়েছে।

ব্যক্তিগত data browser-এ থাকে। Authentication, database, email delivery, cloud sync বা backup import এই demo-তে নেই। Form playground server-এ input validate করে; message পাঠায় বা সংরক্ষণ করে না।

## পরীক্ষার ফল

| পরীক্ষা                                             | ফল                                                                           | তারিখ         |
| --------------------------------------------------- | ---------------------------------------------------------------------------- | ------------- |
| `npm run check` — lint, typecheck, production build | পাস; Next.js 16.3.5-এ quiz-সহ build তৈরি                                     | ২১ সেপ্টেম্বর |
| সম্পূর্ণ `npm run test:e2e`                         | **৩০/৩০ পাস**; ০ failure, ০ flaky, ০ skipped                                 | ২১ সেপ্টেম্বর |
| `npm run format:check`                              | পাস                                                                          | ২১ সেপ্টেম্বর |
| `npm audit --json`                                  | ০টি known vulnerability report করেছে; quiz-এর জন্য নতুন dependency যোগ হয়নি | ২১ সেপ্টেম্বর |

এই ফল **একটি সম্পূর্ণ ৩০-test run**-এর। Limit interruption-এর পরে ২২ সেপ্টেম্বর `playwright-report`-এর summary ও `test-results/.last-run.json` মিলিয়ে সফল run নিশ্চিত করা হয়েছে। Production build ও tests-এ Node.js 20.19.6 এবং Chromium/installed Chrome ব্যবহার হয়েছে।

আগের ২৫টি test course search, bookmarks, progress/resume, API/404, notes, tasks, profile persistence, cross-tab update, JSON export, corrupt/blocked storage, timer completion/reset, server validation, mobile navigation এবং ৯টি route-এর automated accessibility যাচাই করে। নতুন পাঁচটি test question bank ও quiz behavior যাচাই করে:

- সব lesson-এর তিনটি valid question, unique ID/options এবং explanation।
- অসম্পূর্ণ answer submit বন্ধ রাখা, keyboard radio navigation, scoring ও repeated submit একবার count করা।
- Retry-তে best score ধরে রাখা, reload-এর পরে last/best/attempt count এবং screen reader-এর জন্য sidebar score।
- Lesson বদলালে unfinished answers clear, quiz ও lesson completion আলাদা থাকা।
- পুরোনো workspace data অক্ষত থাকা, export/reset, storage failure-এর feedback এবং graded state-এর accessibility/mobile overflow।

Desktop ও mobile dashboard-এর পাশাপাশি quiz-এর question ও graded-result screenshots দেখা হয়েছে।

## Review-তে যেসব সমস্যা ঠিক হয়েছে

- Focus session একাধিকবার count হওয়া এবং reset-এর পর পুরোনো timer ফিরে আসা।
- Reload-এর পরে profile edit, note draft recovery ও storage failure feedback।
- Invalid saved JSON অনিচ্ছায় overwrite হওয়া; original export ও explicit reset এখন আছে।
- Global search query, bookmark persistence, course resume ও unknown course-এর HTTP 404।
- Mobile menu-এর keyboard focus, Escape, background interaction ও horizontal overflow।
- বিভিন্ন page-এর text contrast এবং generated test report-এ অপ্রয়োজনীয় ESLint scan।
- Dependency audit-এ পাওয়া সমস্যা; installed Next.js ও সংশ্লিষ্ট packages update করা হয়েছে।

নতুন terminal-এর Node 18 default এই project চালাতে পারে না। `.nvmrc` যোগ করা হয়েছে; project folder-এ `nvm use` দিয়ে installed Node 20 নির্বাচন করুন। এটি machine-এর global Node default বদলায় না।

## ফলের সীমা ও পুনরায় পরীক্ষা

Automated accessibility scan পূর্ণ accessibility certification নয়। Firefox/Safari, সব device, screen reader journey, performance/load বা production deployment এই suite-এ পরীক্ষা করা হয়নি। Dependency audit-এর ফল সেদিনের advisory database অনুযায়ী।

ইচ্ছাকৃত unknown course request-এ framework server log-এ `NoFallbackError` দেখা গেছে; সেই request-এর HTTP 404 ও not-found UI test পাস করেছে।

পরবর্তী code change-এর পরে project folder থেকে:

```bash
nvm use
npm test
npm run format:check
```

`npm test` lint, typecheck, production build ও সম্পূর্ণ browser suite চালায়। Browser install দরকার হলে [README-এর test নির্দেশনা](../README.md#command-ও-যাচাই) অনুসরণ করুন। শুধু আগের ব্যর্থ test চালাতে `--last-failed` ব্যবহার হয়; সেটি full suite-এর বিকল্প নয়।
