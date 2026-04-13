import { SignOutButton } from "@/components/SignOutButton";
import { ensureMyProfile } from "@/lib/data";
import { updateMyProfile } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await ensureMyProfile();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted">
            Update your profile and handle.
          </p>
        </div>
        <SignOutButton />
      </header>

      <form
        action={updateMyProfile}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="grid gap-4">
          <Field
            label="Handle"
            name="handle"
            placeholder="your_handle"
            defaultValue={me?.handle ?? ""}
            hint="3–20 chars, lowercase letters/numbers/underscore."
          />
          <Field
            label="Display name"
            name="display_name"
            placeholder="Your Name"
            defaultValue={me?.display_name ?? ""}
          />
          <Field
            label="Avatar URL"
            name="avatar_url"
            placeholder="https://…"
            defaultValue={me?.avatar_url ?? ""}
          />
          <div>
            <label className="text-sm font-semibold">Bio</label>
            <textarea
              name="bio"
              defaultValue={me?.bio ?? ""}
              placeholder="A short bio…"
              className="mt-2 min-h-24 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/40"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <button className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/40"
      />
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </div>
  );
}
