import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { markMessageRead, deleteMessage } from "../actions";
import { Suspense } from "react";

async function MessageList() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (!messages || messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`glass rounded-xl p-4 ${
            msg.is_read ? "" : "border-l-2 border-l-accent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-sm font-semibold">{msg.name}</span>
              <span className="ml-2 font-mono text-[10px] text-secondary">{msg.email}</span>
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
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
          <p className="mt-2 text-sm text-muted-foreground">{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold">Contact Messages</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <MessageList />
      </Suspense>
    </div>
  );
}
