"use client";

import {
  initialWorkspace,
  workspaceSchema,
  type WorkspaceState,
} from "./model";

export const STORAGE_KEY = "nextstep-workspace-v1";
type Snapshot = {
  state: WorkspaceState;
  hydrated: boolean;
  storageError: string | null;
  recoveryRaw: string | null;
};
const serverSnapshot: Snapshot = {
  state: initialWorkspace,
  hydrated: false,
  storageError: null,
  recoveryRaw: null,
};
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let state: WorkspaceState = initialWorkspace;
    if (raw !== null) {
      try {
        state = workspaceSchema.parse(JSON.parse(raw));
      } catch {
        snapshot = {
          ...snapshot,
          hydrated: true,
          recoveryRaw: raw,
          storageError:
            "Saved data is invalid and has been preserved. Changes will only last for this visit until you export the original data and reset it in Settings.",
        };
        emit();
        return;
      }
    }
    snapshot = { state, hydrated: true, storageError: null, recoveryRaw: null };
  } catch {
    snapshot = {
      ...snapshot,
      hydrated: true,
      storageError:
        "Browser storage is unavailable. Changes will only last for this visit. You can export them in Settings.",
    };
  }
  emit();
}

function onStorage(event: StorageEvent) {
  if (
    event.storageArea === localStorage &&
    (event.key === STORAGE_KEY || event.key === null)
  )
    readStorage();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    if (!snapshot.hydrated) readStorage();
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}
export const getSnapshot = () => snapshot;
export const getServerSnapshot = () => serverSnapshot;

// এক জায়গায় state update ও persistence; UI component শুধু action call করে।
export function updateWorkspace(
  update: (current: WorkspaceState) => WorkspaceState,
  options?: { reset?: boolean },
) {
  if (!snapshot.hydrated) readStorage();
  const state = workspaceSchema.parse(update(snapshot.state));
  let storageError = snapshot.storageError;
  let recoveryRaw = snapshot.recoveryRaw;
  if (recoveryRaw === null || options?.reset) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageError = null;
      recoveryRaw = null;
    } catch {
      storageError =
        "Your changes are available for this visit, but could not be saved. Export a backup in Settings.";
    }
  }
  snapshot = { state, hydrated: true, storageError, recoveryRaw };
  emit();
}
