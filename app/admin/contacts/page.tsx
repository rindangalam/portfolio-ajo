import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { markMessageRead, deleteMessage } from "../actions";
import { Suspense } from "react";

async function MessageList() {
  const supabase = await createClient();
  const [total, unread] = await Promise.all([
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
  ]);

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (!messages || messages.length === 0) {
    return (
      <>
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="retro-card rounded p-3 text-center">
            <div className="font-display text-2xl font-bold text-accent">0</div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Total</div>
          </div>
        </div>
        <div className="retro-card rounded p-8 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            Belum ada pesan masuk.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="retro-card rounded p-3 text-center">
          <div className="font-display text-2xl font-bold text-accent">{total.count ?? 0}</div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Total</div>
        </div>
        <div className="retro-card rounded p-3 text-center">
          <div className="font-display text-2xl font-bold text-secondary">{unread.count ?? 0}</div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Unread</div>
        </div>
        <div className="retro-card rounded p-3 text-center">
          <div className="font-display text-2xl font-bold text-muted-foreground">{(total.count ?? 0) - (unread.count ?? 0)}</div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Read</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`retro-card rounded p-4 ${
              msg.is_read ? "" : "border-l-2 border-l-accent"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-semibold">{msg.name}</span>
                  <span className="font-mono text-[10px] text-secondary">{msg.email}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.is_verified ? (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase text-accent">
                      Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[9px] uppercase text-amber-400">
                      Pending
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{msg.message}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!msg.is_read && (
                  <form action={async () => { "use server"; await markMessageRead(msg.id); }}>
                    <Button type="submit" variant="outline" size="sm" className="h-9 border-border bg-transparent font-mono text-xs uppercase text-secondary">
                      Mark Read
                    </Button>
                  </form>
                )}
                <form action={async () => { "use server"; await deleteMessage(msg.id); }}>
                  <Button type="submit" variant="outline" size="sm" className="h-9 border-border bg-transparent font-mono text-xs uppercase text-red-400 hover:bg-red-500/10">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-bold">Contact Messages</h1>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Pesan yang dikirim pengunjung melalui form kontak.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <MessageList />
      </Suspense>
    </div>
  );
}
