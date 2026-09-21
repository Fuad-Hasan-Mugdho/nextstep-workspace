"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSnapshot } from "@/features/workspace/store";
import { Icon } from "@/components/ui/icon";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import "./notes.css";

type Draft = {
  id: string | null;
  title: string;
  content: string;
  tag: string;
  original: string;
};
const DRAFT_KEY = "nextstep-note-draft-v1";
const fingerprint = (note: { title: string; content: string; tag: string }) =>
  JSON.stringify([note.title, note.content, note.tag]);

function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      value &&
      typeof value === "object" &&
      "id" in value &&
      "title" in value &&
      "content" in value &&
      "tag" in value &&
      "original" in value &&
      (value.id === null || typeof value.id === "string") &&
      typeof value.title === "string" &&
      typeof value.content === "string" &&
      typeof value.tag === "string" &&
      typeof value.original === "string" &&
      value.title.length <= 120 &&
      value.content.length <= 20000 &&
      value.tag.length <= 40 &&
      value.original.length <= 42000
    )
      return value as Draft;
  } catch {
    /* The editor still works if browser storage is unavailable. */
  }
  return null;
}

function NotesEditor() {
  const { state, addNote, updateNote, deleteNote } = useWorkspace();
  const [draft, setDraft] = useState<Draft | null>(readDraft);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("");
  const [draftStorageError, setDraftStorageError] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const dirty = !!draft && fingerprint(draft) !== draft.original;
  const tags = [...new Set(state.notes.map((note) => note.tag))];
  const needle = query.trim().toLowerCase();
  const notes = [...state.notes]
    .filter(
      (note) =>
        (tag === "" || note.tag === tag) &&
        `${note.title} ${note.content} ${note.tag}`
          .toLowerCase()
          .includes(needle),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  // A separate tab-local draft survives navigation without saving an unfinished note.
  function changeDraft(next: Draft | null) {
    setDraft(next);
    try {
      if (next) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(DRAFT_KEY);
      setDraftStorageError(false);
    } catch {
      setDraftStorageError(true);
    }
  }

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const reset = () => {
      setDraft(null);
      setTag("");
      setQuery("");
      setDeleteId(null);
      setMessage("");
    };
    window.addEventListener("nextstep:reset", reset);
    return () => window.removeEventListener("nextstep:reset", reset);
  }, []);

  function openNote(note?: {
    id: string;
    title: string;
    content: string;
    tag: string;
  }) {
    if (
      dirty &&
      !window.confirm("Discard your unsaved changes and open another note?")
    )
      return;
    const next = note ?? { id: null, title: "", content: "", tag: "Learning" };
    changeDraft({ ...next, original: fingerprint(next) });
    setMessage("");
    setDeleteId(null);
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const input = {
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag.trim() || "Learning",
    };
    if (!input.title || !input.content) {
      setMessage("Add a title and a little something to remember.");
      return;
    }
    if (
      input.title.length > 120 ||
      input.content.length > 20000 ||
      input.tag.length > 40
    ) {
      setMessage(
        "Keep the title within 120 characters, note within 20,000, and tag within 40.",
      );
      return;
    }
    try {
      if (draft.id && state.notes.some((note) => note.id === draft.id))
        updateNote(draft.id, input);
      else addNote(input);
    } catch {
      setMessage(
        "Your note could not be saved. Your draft is still here; please try again.",
      );
      return;
    }
    changeDraft(null);
    setTag("");
    setQuery("");
    setMessage(
      getSnapshot().storageError
        ? "Note added to this session. Browser storage is unavailable."
        : "Note saved. Your future self will thank you.",
    );
  }

  function confirmDelete(id: string) {
    deleteNote(id);
    if (draft?.id === id) changeDraft(null);
    setDeleteId(null);
    setTag("");
    setMessage("Note deleted.");
  }

  return (
    <>
      <div className="notes-heading">
        <div>
          <p className="eyebrow">YOUR SECOND BRAIN</p>
          <h1 className="page-heading">Little notes. Big ideas.</h1>
          <p className="page-subtitle">
            Keep the aha moments, code snippets, and things you want to
            remember.
          </p>
        </div>
        <button className="button button-primary" onClick={() => openNote()}>
          <Icon name="plus" size={18} /> New note
        </button>
      </div>
      <div className="notes-toolbar">
        <label className="notes-search">
          <Icon name="search" size={18} />
          <input
            aria-label="Search notes"
            placeholder="Find something you wrote…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="notes-tag-select">
          Tag
          <select
            aria-label="Filter notes by tag"
            value={tags.includes(tag) ? tag : ""}
            onChange={(event) => setTag(event.target.value)}
          >
            <option value="">All tags</option>
            {tags.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <span className="muted">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
      </div>
      <p className="notes-feedback" role="status">
        {message}
      </p>
      <div className={`notes-layout ${draft ? "has-editor" : ""}`}>
        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="panel empty-state notes-empty">
              <span className="notes-empty-icon">
                <Icon name="notes" size={28} />
              </span>
              <h2>
                {query || tag !== ""
                  ? "No notes match just yet"
                  : "Make room for your next idea"}
              </h2>
              <p>
                {query || tag !== ""
                  ? "Try another keyword or show all your tags."
                  : "A small insight today can become your next big project. Write it down."}
              </p>
              <button
                className="button button-secondary"
                onClick={() =>
                  query || tag !== "" ? (setQuery(""), setTag("")) : openNote()
                }
              >
                {query || tag !== ""
                  ? "Clear filters"
                  : "Write your first note"}
              </button>
            </div>
          ) : (
            notes.map((note, index) => (
              <article
                className={`panel note-card note-tint-${index % 4} ${draft?.id === note.id ? "is-editing" : ""}`}
                key={note.id}
              >
                <div className="note-card-top">
                  <span className="note-tag">{note.tag}</span>
                  <button
                    className="button button-ghost note-icon-button"
                    aria-label={`Edit ${note.title}`}
                    onClick={() => openNote(note)}
                  >
                    <Icon name="edit" size={17} />
                  </button>
                </div>
                <button className="note-open" onClick={() => openNote(note)}>
                  <h2>{note.title}</h2>
                  <p>{note.content}</p>
                </button>
                <div className="note-card-bottom">
                  <time dateTime={note.updatedAt}>
                    {new Date(note.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <button
                    className="button button-ghost note-icon-button"
                    aria-label={`Delete ${note.title}`}
                    onClick={() => setDeleteId(note.id)}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
                {deleteId === note.id && (
                  <div className="note-delete-confirm" role="alert">
                    <p>
                      Delete this note
                      {draft?.id === note.id && dirty
                        ? " and its unsaved draft"
                        : ""}
                      ? This cannot be undone.
                    </p>
                    <div>
                      <button
                        className="button notes-delete-button"
                        onClick={() => confirmDelete(note.id)}
                      >
                        Delete note
                      </button>
                      <button
                        className="button button-secondary"
                        onClick={() => setDeleteId(null)}
                      >
                        Keep it
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
        {draft && (
          <section
            className="panel note-editor"
            aria-labelledby="note-editor-title"
          >
            <div className="note-editor-heading">
              <div>
                <span className="eyebrow">CAPTURE THE IDEA</span>
                <h2 id="note-editor-title">
                  {draft.id ? "Edit your note" : "A fresh page"}
                </h2>
              </div>
              <button
                className="button button-ghost note-icon-button"
                aria-label="Close editor"
                onClick={() => {
                  if (!dirty || window.confirm("Discard your unsaved changes?"))
                    changeDraft(null);
                }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <form onSubmit={saveNote} className="notes-form">
              <label className="form-field">
                Title
                <input
                  className="input"
                  autoFocus
                  maxLength={120}
                  required
                  value={draft.title}
                  onChange={(event) =>
                    changeDraft({ ...draft, title: event.target.value })
                  }
                  placeholder="Give your idea a name"
                />
              </label>
              <label className="form-field">
                Tag
                <input
                  className="input"
                  maxLength={40}
                  value={draft.tag}
                  onChange={(event) =>
                    changeDraft({ ...draft, tag: event.target.value })
                  }
                  placeholder="e.g. React, Next.js, Ideas"
                />
              </label>
              <label className="form-field">
                Your note
                <textarea
                  className="input"
                  rows={12}
                  maxLength={20000}
                  required
                  value={draft.content}
                  onChange={(event) =>
                    changeDraft({ ...draft, content: event.target.value })
                  }
                  placeholder="What clicked today? Write it in your own words…"
                />
              </label>
              <div className="note-editor-footer">
                <span className="muted">
                  {draft.content.length.toLocaleString()} / 20,000
                </span>
                <button className="button button-primary" type="submit">
                  <Icon name="check" size={17} /> Save note
                </button>
              </div>
              <p className="note-draft-hint">
                {draftStorageError
                  ? "Draft backup is unavailable. Save your note before leaving this page."
                  : "Your draft stays in this browser tab as you explore. Click Save note to keep it in your workspace."}
              </p>
            </form>
          </section>
        )}
      </div>
    </>
  );
}

export function NotesWorkspace() {
  const { hydrated } = useWorkspace();
  return hydrated ? (
    <NotesEditor />
  ) : (
    <div className="panel empty-state" role="status">
      Opening your notebook…
    </div>
  );
}
