"use client";

import { useState, useTransition } from "react";
import { IconLogout } from "@tabler/icons-react";
import { signOutAction } from "@/app/(app)/perfil/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

export function SignOutButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tap-target flex w-full items-center justify-between gap-3 text-base font-semibold text-state-danger transition-colors active:opacity-75"
      >
        <span className="inline-flex items-center gap-3">
          <IconLogout size={22} aria-hidden />
          Cerrar sesión
        </span>
      </button>

      <ConfirmModal
        open={open}
        onCancel={() => !isPending && setOpen(false)}
        onConfirm={confirm}
        busy={isPending}
        tone="danger"
        icon={<IconLogout size={22} stroke={2.2} aria-hidden />}
        title="¿Cerrar tu sesión?"
        description={
          <>
            <p>
              Saldrás de tu cuenta en este dispositivo. Tus datos siguen seguros y
              podrás volver a entrar con tu correo cuando quieras.
            </p>
          </>
        }
        confirmLabel="Sí, cerrar sesión"
        cancelLabel="Quedarme"
      />
    </>
  );
}
