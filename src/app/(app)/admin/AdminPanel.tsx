"use client";

import { useMemo, useState } from "react";

type AdminProfile = {
  id: string;
  handle: string;
  display_name: string | null;
  verified: boolean;
};

export function AdminPanel() {
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "ready" | "saving"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const normalizedHandle = useMemo(
    () => handle.trim().toLowerCase().replaceAll(/[^a-z0-9_]/g, ""),
    [handle],
  );

  async function lookup() {
    setStatus("loading");
    setError(null);
    setProfile(null);

    const res = await fetch(`/api/admin/profile?handle=${normalizedHandle}`, {
      method: "GET",
    });
    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      profile?: AdminProfile | null;
    };

    if (!res.ok) {
      setError(json.error || "Failed to look up profile.");
      setStatus("error");
      return;
    }

    if (!json.profile) {
      setError("No profile found for that handle.");
      setStatus("error");
      return;
    }

    setProfile(json.profile);
    setStatus("ready");
  }

  async function setVerified(verified: boolean) {
    if (!profile) return;
    setStatus("saving");
    setError(null);

    const res = await fetch(`/api/admin/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handle: profile.handle, verified }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      profile?: AdminProfile | null;
    };

    if (!res.ok) {
      setError(json.error || "Failed to update verification.");
      setStatus("error");
      return;
    }

    setProfile((json.profile ?? null) as AdminProfile | null);
    setStatus("ready");
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-extrabold">Admin</h2>
      <p className="mt-1 text-sm text-muted">
        Toggle verification by handle (e.g. <span className="font-semibold">@james</span>).
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label className="text-sm font-extrabold">Handle</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <span className="text-muted">@</span>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="handle"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="mt-1 text-xs text-muted">
            Using: <span className="font-semibold">{normalizedHandle || "—"}</span>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={lookup}
            disabled={!normalizedHandle || status === "loading" || status === "saving"}
            className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-extrabold text-background disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "loading" ? "Looking…" : "Look up"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-border bg-background p-3 text-sm">
          <div className="font-extrabold text-red-600">Error</div>
          <div className="mt-1 text-red-600">{error}</div>
        </div>
      ) : null}

      {profile ? (
        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <div className="text-sm font-extrabold">
            {profile.display_name || profile.handle}{" "}
            <span className="font-semibold text-muted">@{profile.handle}</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="text-muted">Verified:</span>
            <span className="font-extrabold">
              {profile.verified ? "Yes" : "No"}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setVerified(true)}
              disabled={status === "saving" || profile.verified}
              className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white disabled:opacity-60"
            >
              Verify
            </button>
            <button
              type="button"
              onClick={() => setVerified(false)}
              disabled={status === "saving" || !profile.verified}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-extrabold hover:bg-border disabled:opacity-60"
            >
              Remove
            </button>
            {status === "saving" ? (
              <span className="text-sm text-muted">Saving…</span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
