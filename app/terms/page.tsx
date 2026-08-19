import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Rindang Alam Nur Muhammad",
  description: "Terms for using rindangalam.dev.",
};

const sections = [
  {
    title: "1. Use of the site",
    body: "You may browse the portfolio freely. Content, code samples, and designs shown here are for informational purposes and remain the property of their respective owners unless stated otherwise.",
  },
  {
    title: "2. Contact form",
    body: "Messages must be genuine and non-abusive. Spam, harassment, or solicitation sent through the contact form may be blocked or ignored.",
  },
  {
    title: "3. Availability",
    body: "The site and its content are provided as-is, without warranties. I may update, remove, or change content at any time without notice.",
  },
  {
    title: "4. Contact",
    body: "Questions about these terms can be sent to rindangalam04@gmail.com.",
  },
];

export default function TermsPage() {
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
          Terms of Service
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
