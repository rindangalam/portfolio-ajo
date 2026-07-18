"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markMessageRead, deleteMessage } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  is_verified: boolean;
  created_at: string;
  verified_at: string | null;
};

export function MessagesList({
  messages,
  total,
  unread,
}: {
  messages: Message[];
  total: number;
  unread: number;
}) {
  const [selected, setSelected] = useState<Message | null>(null);
  const router = useRouter();

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="retro-card rounded p-3 text-center">
          <div className="font-display text-2xl font-bold text-accent">{total}</div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Total</div>
        </div>
        <div className="retro-card rounded p-3 text-center">
          <div className="font-display text-2xl font-bold text-secondary">{unread}</div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Unread</div>
        </div>
        <div className="retro-card rounded p-3 text-center">
          <div className="font-display text-2xl font-bold text-muted-foreground">{total - unread}</div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Read</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <button
            key={msg.id}
            type="button"
            onClick={() => setSelected(msg)}
            className={`retro-card w-full cursor-pointer rounded p-4 text-left transition-colors hover:bg-accent/5 ${
              msg.is_read ? "" : "border-l-2 border-l-accent"
            }`}
          >
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
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {msg.message}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="retro-card w-full max-w-lg rounded p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">{selected.name}</h2>
                <p className="mt-0.5 font-mono text-xs text-secondary">{selected.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="font-mono text-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">
                {new Date(selected.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {selected.is_verified ? (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase text-accent">
                  Verified
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[9px] uppercase text-amber-400">
                  Pending
                </span>
              )}
              {!selected.is_read && (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase text-accent">
                  New
                </span>
              )}
            </div>

            <div className="mb-6 max-h-60 overflow-y-auto rounded-lg bg-background/50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {selected.message}
              </p>
            </div>

            <div className="flex gap-2">
              {!selected.is_read && (
                <form
                  action={async () => {
                    await markMessageRead(selected.id);
                    router.refresh();
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="h-9 border-border bg-transparent font-mono text-xs uppercase text-secondary"
                  >
                    Mark Read
                  </Button>
                </form>
              )}
              <form
                action={async () => {
                  await deleteMessage(selected.id);
                  setSelected(null);
                  router.refresh();
                }}
              >
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="h-9 border-border bg-transparent font-mono text-xs uppercase text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
