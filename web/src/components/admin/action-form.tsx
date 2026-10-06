"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import { Spinner } from "@/components/spinner";

/**
 * A form wired to a server action that returns FormState. Shows errors and a
 * short confirmation, disables inputs while saving, and can ask "are you sure?".
 */
export function ActionForm({
  action,
  children,
  className,
  okText,
  confirmText,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
  okText?: string;
  confirmText?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      {pending && <Spinner size="sm" label="Saving" className="self-center text-ink" />}
      {state?.error && (
        <p role="alert" className="basis-full text-sm font-semibold text-danger">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p role="status" className="basis-full text-sm font-semibold text-sea">
          {state.message}
        </p>
      )}
      {state?.ok && okText && (
        <p role="status" className="basis-full text-sm font-semibold text-sea">
          {okText}
        </p>
      )}
    </form>
  );
}
