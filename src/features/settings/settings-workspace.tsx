"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import { profileSchema } from "@/features/workspace/model";
import { getSnapshot } from "@/features/workspace/store";

function downloadFile(content: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SettingsWorkspace() {
  const { state, hydrated, recoveryRaw, updateProfile, resetData } =
    useWorkspace();
  // null থাকলে hydrated store-এর profile দেখাই; user লিখলে নিজের draft রাখি।
  const [draft, setDraft] = useState<{
    name: string;
    weeklyGoal: string;
  } | null>(null);
  const profile = draft ?? {
    name: state.profile.name,
    weeklyGoal: String(state.profile.weeklyGoal),
  };
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  function saveProfile(event: FormEvent) {
    event.preventDefault();
    const result = profileSchema.safeParse({
      ...profile,
      weeklyGoal: Number(profile.weeklyGoal),
    });
    if (!result.success) {
      setError(
        "Use a name of 1–40 characters and a whole-number goal from 1 to 30.",
      );
      setMessage("");
      return;
    }
    updateProfile(result.data);
    setDraft(null);
    setError("");
    setMessage(
      getSnapshot().storageError
        ? "Profile updated for this visit. Please export a backup."
        : "Settings saved successfully!",
    );
  }

  function reset() {
    resetData();
    setDraft(null);
    setConfirmReset(false);
    setError("");
    setMessage(
      getSnapshot().storageError
        ? "Workspace reset for this visit. Browser storage could not be updated."
        : "Workspace reset. Your next chapter is ready.",
    );
  }

  return (
    <div className="settings-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE IT YOURS</div>
          <h1>Workspace settings</h1>
          <p className="page-subtitle">
            Your name, your pace, your learning space.
          </p>
        </div>
      </div>
      <section className="panel">
        <h2>Profile & learning goals</h2>
        <form onSubmit={saveProfile} className="settings-form">
          <fieldset disabled={!hydrated} className="plain-fieldset">
            <div className="form-group">
              <label htmlFor="display-name">Display name</label>
              <input
                id="display-name"
                value={profile.name}
                onChange={(event) =>
                  setDraft({ ...profile, name: event.target.value })
                }
                maxLength={40}
                required
                autoComplete="given-name"
              />
              <small>Used for the greetings in your workspace.</small>
            </div>
            <div className="form-group">
              <label htmlFor="weekly-goal">Weekly goal</label>
              <input
                id="weekly-goal"
                type="number"
                min={1}
                max={30}
                step={1}
                required
                value={profile.weeklyGoal}
                onChange={(event) =>
                  setDraft({ ...profile, weeklyGoal: event.target.value })
                }
              />
              <small>
                1–30 lessons per week. The week starts on Monday in your local
                time.
              </small>
            </div>
            <button type="submit" className="button">
              <Icon name="check" size={16} />
              Save changes
            </button>
          </fieldset>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>
      <section className="panel">
        <h2>Your data, in your hands</h2>
        <p className="muted">
          Progress, quiz scores, notes, tasks, bookmarks and completed focus
          sessions stay in this browser. Export a JSON copy before clearing
          browser data or switching devices. This app currently exports backups
          for inspection; automatic import is not included.
        </p>
        <button
          type="button"
          className="button button-secondary"
          disabled={!hydrated}
          onClick={() =>
            downloadFile(
              JSON.stringify(state, null, 2),
              "nextstep-workspace.json",
            )
          }
        >
          <Icon name="download" size={16} />
          Export workspace
        </button>
        {recoveryRaw !== null && (
          <div className="recovery-notice">
            <p>
              The original saved data could not be validated. Download it for
              recovery before resetting.
            </p>
            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                downloadFile(recoveryRaw, "nextstep-recovery.json")
              }
            >
              Export original data
            </button>
          </div>
        )}
      </section>
      <section className="panel danger-section">
        <h2>Start fresh</h2>
        <p className="muted">
          Reset your profile, progress, quiz scores, bookmarks, notes, tasks,
          focus history and this tab’s draft and timer.
        </p>
        {confirmReset ? (
          <div className="confirm-box">
            <p>
              This removes your saved workspace. Export anything you want to
              keep first.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="button button-danger"
                onClick={reset}
              >
                Yes, reset everything
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="button button-danger"
            disabled={!hydrated}
            onClick={() => setConfirmReset(true)}
          >
            <Icon name="trash" size={16} />
            Reset all progress
          </button>
        )}
      </section>
      {message && (
        <p className="feedback-message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
