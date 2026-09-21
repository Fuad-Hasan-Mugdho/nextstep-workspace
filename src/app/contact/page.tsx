import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { ContactForm } from "@/features/contact/contact-form";
import "@/features/contact/contact.css";

export const metadata: Metadata = {
  title: "Server Action playground",
  description:
    "FormData, Zod validation ও useActionState দিয়ে Next.js Server Action হাতে-কলমে শিখুন।",
};

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">LEARN BY EXPERIMENTING</p>
          <h1>Server Action playground</h1>
          <p className="page-subtitle">
            একটি ছোট form। Browser থেকে server পর্যন্ত শেখার পুরো সুযোগ।
          </p>
        </div>
        <Link href="/about" className="button button-secondary">
          Project tour <Icon name="arrow-up-right" size={16} />
        </Link>
      </div>
      <div className="contact-layout">
        <section
          className="panel contact-form-panel"
          aria-labelledby="contact-heading"
        >
          <div className="contact-form-header">
            <div className="contact-symbol">
              <Icon name="arrow-up-right" size={26} />
            </div>
            <span className="badge">INTERACTIVE DEMO</span>
          </div>
          <h2 id="contact-heading">Let’s make a round trip.</h2>
          <p className="contact-intro">
            Sample তথ্য লিখে submit করুন। Server সেগুলো যাচাই করে result ফিরিয়ে
            দেবে — error আর success, দুটোই পরীক্ষা করুন।
          </p>
          <ContactForm />
        </section>
        <aside className="contact-aside" aria-label="How this demo works">
          <section className="contact-explanation panel">
            <p className="eyebrow">WHAT HAPPENS NEXT?</p>
            <h2>Follow your data.</h2>
            <ol className="contact-steps">
              <li>
                <span>01</span>
                <div>
                  <strong>Browser checks</strong>
                  <p>
                    <code>required</code> ও <code>{'type="email"'}</code> দিয়ে
                    সাধারণ ভুল browser-এই ধরা পড়ে।
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Server validates</strong>
                  <p>
                    <code>“use server”</code> action-এ Zod যাচাই করে। Client
                    checks এড়িয়ে গেলেও server আবার check করে।
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>React updates the UI</strong>
                  <p>
                    <code>useActionState</code> দিয়ে pending, field errors ও
                    success message দেখানো হয়।
                  </p>
                </div>
              </li>
            </ol>
          </section>
          <section className="contact-demo-note">
            <Icon name="info" size={19} />
            <div>
              <h3>A playground, with real validation.</h3>
              <p>
                এটি contact form-এর শেখার demo। কোনো email পাঠানো হয় না,
                database-এ message রাখা হয় না। কোনো account বা API key লাগবে
                না।
              </p>
            </div>
          </section>
        </aside>
      </div>
      <section
        className="panel contact-exercise"
        aria-labelledby="contact-exercise-heading"
      >
        <div className="contact-exercise-icon">
          <Icon name="code" size={26} />
        </div>
        <div>
          <p className="eyebrow">YOUR NEXT LITTLE CHALLENGE</p>
          <h2 id="contact-exercise-heading">
            একটি “Subject” field যোগ করে দেখুন।
          </h2>
          <p>
            <code>schema.ts</code>-এ rule, <code>actions.ts</code>-এ FormData
            এবং <code>contact-form.tsx</code>-এ input যোগ করুন। বিস্তারিত
            walkthrough আছে <code>docs/LEARNING_GUIDE.bn.md</code>-এ।
          </p>
        </div>
      </section>
    </div>
  );
}
