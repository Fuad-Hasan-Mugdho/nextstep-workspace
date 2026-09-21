"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { useWorkspace } from "@/features/workspace/workspace-provider";

const navigation = [
  { href: "/", label: "Overview", icon: "dashboard" },
  { href: "/courses", label: "My learning", icon: "book" },
  { href: "/roadmap", label: "My roadmap", icon: "route" },
  { href: "/notes", label: "My notes", icon: "notes" },
  { href: "/focus", label: "Focus room", icon: "clock" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useWorkspace();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activePage = navigation.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
  const pageTitle =
    activePage?.label ??
    (pathname === "/about"
      ? "Project guide"
      : pathname === "/settings"
        ? "Settings"
        : pathname === "/contact"
          ? "Server Action lab"
          : "Page not found");
  const initials = state.profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebarRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
      if (event.key === "Tab") {
        const links =
          sidebarRef.current?.querySelectorAll<HTMLElement>("a, button");
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    const media = window.matchMedia("(min-width: 769px)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!notificationOpen) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") setNotificationOpen(false);
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [notificationOpen]);

  function navLink(
    href: "/about" | "/settings",
    label: string,
    icon: IconName,
  ) {
    return (
      <Link
        className={`sidebar-link ${pathname === href ? "active" : ""}`}
        href={href}
        aria-current={pathname === href ? "page" : undefined}
        onClick={() => setMenuOpen(false)}
      >
        <Icon name={icon} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {menuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        id="sidebar-navigation"
        role={menuOpen ? "dialog" : undefined}
        aria-modal={menuOpen || undefined}
        aria-label="Workspace navigation"
        className={`sidebar ${menuOpen ? "is-open" : ""}`}
      >
        <Link
          href="/"
          className="brand"
          onClick={() => setMenuOpen(false)}
          aria-label="NextStep home"
        >
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          nextstep<span className="brand-dot">.</span>
        </Link>
        <div className="workspace-label">
          <span className="workspace-icon">
            <Icon name="code" size={17} />
          </span>
          <div>
            <strong>My workspace</strong>
            <small>A little better, every day</small>
          </div>
          <span className="free-badge">FREE</span>
        </div>
        <p className="sidebar-label">WORKSPACE</p>
        <nav aria-label="Main navigation" className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${activePage?.href === item.href ? "active" : ""}`}
              aria-current={activePage?.href === item.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.href === "/courses" && <span className="nav-count">4</span>}
              {item.href === "/focus" && <span className="tiny-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">
              <Icon name="sparkles" size={19} />
            </span>
            <h3>Small steps. Big things.</h3>
            <p>
              You don’t have to learn it all today. Just take the next step.
            </p>
            <Link href="/roadmap" onClick={() => setMenuOpen(false)}>
              Find your path <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          <nav
            aria-label="Help and preferences"
            className="sidebar-nav secondary-nav"
          >
            {navLink("/about", "Understand this project", "code")}
            {navLink("/settings", "Settings", "settings")}
          </nav>
          <Link
            href="/settings"
            className="sidebar-profile"
            onClick={() => setMenuOpen(false)}
          >
            <span className="avatar">{initials}</span>
            <span>
              <strong>{state.profile.name}</strong>
              <small>Curious mind, future builder</small>
            </span>
            <Icon name="chevron-right" size={16} />
          </Link>
        </div>
      </aside>
      <div className="app-body" inert={menuOpen}>
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <button
              type="button"
              ref={menuButtonRef}
              className="icon-button mobile-menu"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              aria-controls="sidebar-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="menu" />
            </button>
            <span className="breadcrumb-home">Workspace</span>
            <Icon name="chevron-right" size={14} />
            <strong>{pageTitle}</strong>
          </div>
          <div className="topbar-actions">
            <form action="/courses" className="global-search" role="search">
              <Icon name="search" size={17} />
              <input
                name="q"
                placeholder="Search your next skill…"
                aria-label="Search courses"
              />
              <kbd>↵</kbd>
            </form>
            <div className="notification-wrapper">
              <button
                type="button"
                className="icon-button"
                aria-label="Learning updates"
                aria-expanded={notificationOpen}
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Icon name="bell" />
              </button>
              {notificationOpen && (
                <div className="notification-popover">
                  <strong>Your learning, at a glance</strong>
                  <p>
                    {state.completedLessonIds.length} lessons completed. Your
                    weekly goal is {state.profile.weeklyGoal} lessons.
                  </p>
                  <Link
                    href="/roadmap"
                    onClick={() => setNotificationOpen(false)}
                  >
                    Check your roadmap <Icon name="arrow-right" size={14} />
                  </Link>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => setNotificationOpen(false)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
            <span className="topbar-divider" />
            <Link
              href="/settings"
              className="avatar avatar-small"
              aria-label="Profile settings"
            >
              {initials}
            </Link>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="main-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>Made for curious minds. Built with Next.js.</span>
          <Link href="/about">
            Learn how it works <Icon name="arrow-up-right" size={13} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
