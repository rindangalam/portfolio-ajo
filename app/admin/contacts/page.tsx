import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { MessagesList } from "@/components/messages-list";

async function MessageList() {
  noStore();

  const supabase = await createClient();
  const [total, unread] = await Promise.all([
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_verified", true),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_verified", true).eq("is_read", false),
  ]);

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("is_verified", true)
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
    <MessagesList messages={messages} total={total.count ?? 0} unread={unread.count ?? 0} />
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
