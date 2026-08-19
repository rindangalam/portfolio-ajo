import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Rindang Alam Nur Muhammad",
  description: "How rindangalam.dev collects, uses, and protects your data.",
};

const sections = [
  {
    title: "1. What I collect",
    body: "This site is a static portfolio. Visiting pages does not set cookies or track you. The contact form stores the name, email, and message you submit in a Supabase database so I can reply to you. The admin area uses an email/password session handled by Supabase Auth.",
  },
  {
    title: "2. How I use it",
    body: "Contact details are used only to respond to your message. I do not sell, rent, or share your data with third parties. Analytics, if ever enabled, would be aggregated and anonymized.",
  },
  {
    title: "3. Storage and retention",
    body: "Messages are stored on Supabase infrastructure and deleted when you ask or when they are no longer needed. Your data is never used for anything other than the purpose it was given.",
  },
  {
    title: "4. Your rights",
    body: "You can request a copy or deletion of your data at any time by emailing rindangalam04@gmail.com.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="dark relative min-h-dvh px-5 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          &larr; back home
        </Link>
        <h1 className="mt-6 font-display text-5xl font-bold text-gradient">
          Privacy Policy
        </h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          last updated: august 2026
        </p>
        <div className="mt-10 flex flex-col gap-8">
          {sections.map((s) => (
            <section key={s.title} className="glass rounded-xl p-6">
              <h2 className="font-display text-xl font-bold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
