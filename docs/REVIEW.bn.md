# NextStep — যাচাই প্রতিবেদন

শেষ যাচাই: **২১ সেপ্টেম্বর ২০২৬**। শেখার জন্য নির্ধারিত demo scope-এর implementation ও review শেষ হয়েছে। এটি bug-free হওয়ার বা “১০০/১০০” quality score-এর নিশ্চয়তা নয়।

## কী সম্পূর্ণ হয়েছে

Dashboard, চারটি course-এর ১৬টি বাংলা lesson, search/filter/bookmark, lesson progress, notes CRUD, roadmap tasks, focus timer, settings/export/reset এবং Server Action form playground কাজ করছে। বাংলা project tour, architecture guide ও learning guide code-এর সঙ্গে মিলিয়ে review করা হয়েছে।

ব্যক্তিগত data browser-এ থাকে। Authentication, database, email delivery, cloud sync বা backup import এই demo-তে নেই। Form playground server-এ input validate করে; message পাঠায় বা সংরক্ষণ করে না।

## পরীক্ষার ফল

| পরীক্ষা                                                             | ফল                                                   | তারিখ         |
| ------------------------------------------------------------------- | ---------------------------------------------------- | ------------- |
| Production build, Next.js 16.3.5                                    | পাস; শেষ contrast fix-সহ build তৈরি                  | ১৫ সেপ্টেম্বর |
| সম্পূর্ণ Playwright suite                                           | ২৫টির মধ্যে ২৪টি পাস; dashboard text contrast ব্যর্থ | ১৫ সেপ্টেম্বর |
| Contrast সংশোধনের পর বাকি test, `npm run test:e2e -- --last-failed` | ১টির মধ্যে ১টি পাস                                   | ২১ সেপ্টেম্বর |
| `npm run lint`                                                      | পাস                                                  | ২১ সেপ্টেম্বর |
| `npm run typecheck`                                                 | পাস                                                  | ২১ সেপ্টেম্বর |
| `npm audit --json`                                                  | ০টি known vulnerability report করেছে                 | ২১ সেপ্টেম্বর |

পূর্ণ run ও সংশোধিত test-এর rerun মিলিয়ে সব ২৫টি test-এর passing result আছে। ২১ সেপ্টেম্বর নতুন করে সব ২৫টি একসঙ্গে চালানো হয়নি। Browser tests production build ও Chromium/installed Chrome ব্যবহার করেছে। শেষ lint, typecheck ও browser rerun-এ Node.js 20.19.6 ব্যবহার হয়েছে।

২৫টি test-এর মধ্যে ৯টি route-এর automated accessibility scan এবং ১৬টি behavior/layout check আছে। এগুলো course search, bookmarks, progress/resume, API/404, notes, tasks, profile persistence, cross-tab update, JSON export, corrupt/blocked storage, timer completion/reset, server validation ও mobile keyboard navigation যাচাই করে। Desktop ও mobile dashboard screenshot-ও দেখা হয়েছে।

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
