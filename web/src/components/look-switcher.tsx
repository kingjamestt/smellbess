"use client";

import { useSyncExternalStore } from "react";

/** DESIGN PREVIEW ONLY. Remove once the owners pick a look. */
export const LOOKS = [
  { id: "carnival", label: "1 · Carnival" },
  { id: "luxe", label: "2 · Luxe" },
  { id: "forest", label: "3 · Forest" },
] as const;
export type Look = (typeof LOOKS)[number]["id"];
/** The owners' pick (Oct 2026). Light or dark follows the phone. */
export const DEFAULT_LOOK: Look = "forest";
export const LOOK_KEY = "smellbess.look";

/**
 * Runs before first paint (inline in <head>) so there's no flash of the
 * wrong look. ?look=luxe in the URL wins and is remembered.
 */
export const LOOK_BOOT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get("look");var ok=${JSON.stringify(
  LOOKS.map((l) => l.id),
)};var l=ok.indexOf(q)>=0?q:localStorage.getItem("${LOOK_KEY}");if(ok.indexOf(l)<0)l="${DEFAULT_LOOK}";document.documentElement.dataset.look=l;if(q)localStorage.setItem("${LOOK_KEY}",l);}catch(e){}})();`;

/** The look lives on <html data-look>. Writing it is outside React on purpose. */
function applyLook(id: Look) {
  document.documentElement.dataset.look = id;
  try {
    localStorage.setItem(LOOK_KEY, id);
  } catch {
    // private mode: still switches for this page view
  }
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-look"] });
  return () => observer.disconnect();
}

const readLook = () => (document.documentElement.dataset.look as Look | undefined) ?? DEFAULT_LOOK;

export function LookSwitcher() {
  const look = useSyncExternalStore(subscribe, readLook, () => DEFAULT_LOOK);
  const choose = applyLook;

  return (
    <div
      role="group"
      aria-label="Design preview: choose a look"
      className="fixed right-3 bottom-3 z-50 flex items-center gap-1 rounded-full bg-[#17131f] p-1 text-xs font-bold text-white shadow-lg"
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", letterSpacing: 0 }}
    >
      <span className="px-2 opacity-70">Look</span>
      {LOOKS.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={look === l.id}
          onClick={() => choose(l.id)}
          className={`min-h-9 rounded-full px-3 ${look === l.id ? "bg-white text-[#17131f]" : "hover:bg-white/15"}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
