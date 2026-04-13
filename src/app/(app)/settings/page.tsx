import { SignOutButton } from "@/components/SignOutButton";
import { ensureMyProfile } from "@/lib/data";
import { updateMyProfile } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await ensureMyProfile();

  return (
    <div>
      <header className="border-b border-border px-4 py-3">
        <div className="text-lg font-extrabold">Settings</div>
        <div className="text-xs text-muted">Update your profile and handle.</div>
      </header>

      <form action={updateMyProfile} className="px-4 py-4">
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
            <label className="text-sm font-extrabold">Bio</label>
            <textarea
              name="bio"
              defaultValue={me?.bio ?? ""}
              placeholder="A short bio…"
              className="mt-2 min-h-24 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/25"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <SignOutButton />
          <button className="rounded-full bg-foreground px-5 py-2.5 text-sm font-extrabold text-background">
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
      <label className="text-sm font-extrabold">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/25"
      />
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </div>
  );
}
