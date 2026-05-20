"use client";

import { useState, useTransition } from "react";
import { IconHeartHandshake, IconTrash, IconPlus } from "@tabler/icons-react";
import type { TrustedContact } from "@renace/supabase";
import {
  addTrustedContactAction,
  deleteTrustedContactAction
} from "@/app/(app)/perfil/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

export function TrustedContactsManager({ contacts }: { contacts: TrustedContact[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TrustedContact | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Faltan nombre o teléfono");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", name.trim());
      fd.set("phone", phone.trim());
      if (relation.trim()) fd.set("relation", relation.trim());
      const result = await addTrustedContactAction(fd);
      if (!result.ok) setError(result.error);
      else {
        setName("");
        setPhone("");
        setRelation("");
        setOpen(false);
      }
    });
  }

  function confirmRemove() {
    if (!pendingDelete) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", pendingDelete.id);
      await deleteTrustedContactAction(fd);
      setPendingDelete(null);
    });
  }

  return (
    <section id="trusted" aria-labelledby="trusted-title" className="card">
      <div className="flex items-center gap-2">
        <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-brand-100 text-brand-600">
          <IconHeartHandshake size={18} aria-hidden />
        </span>
        <h2 id="trusted-title" className="flex-1 text-base font-bold text-ink-primary">
          Contactos de confianza
        </h2>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Aparecen en el botón SOS de tu inicio. Una llamada cambia el día.
      </p>

      {contacts.length > 0 && (
        <ul role="list" className="mt-3 flex flex-col gap-2">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-lg border border-outline-soft bg-canvas px-3 py-2"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-primary">{c.name}</p>
                <p className="text-xs text-ink-subtle">
                  {c.phone}
                  {c.relation ? ` · ${c.relation}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingDelete(c)}
                aria-label={`Borrar ${c.name}`}
                className="tap-target -mr-2 grid place-items-center rounded-full text-ink-subtle transition-colors hover:text-state-danger"
              >
                <IconTrash size={18} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <div className="mt-3 flex flex-col gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="tap-target rounded-lg border border-outline-medium bg-canvas px-3 text-base text-ink-primary outline-none focus:border-brand-600"
            aria-label="Nombre del contacto"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="Teléfono"
            className="tap-target rounded-lg border border-outline-medium bg-canvas px-3 text-base text-ink-primary outline-none focus:border-brand-600"
            aria-label="Teléfono del contacto"
          />
          <input
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Relación (opcional)"
            className="tap-target rounded-lg border border-outline-medium bg-canvas px-3 text-base text-ink-primary outline-none focus:border-brand-600"
            aria-label="Relación con el contacto"
          />
          {error && (
            <p role="alert" className="text-sm font-semibold text-state-danger">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary flex-1"
              onClick={submit}
              disabled={isPending}
            >
              {isPending ? "Añadiendo…" : "Añadir"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-secondary mt-3 inline-flex items-center justify-center gap-1.5"
        >
          <IconPlus size={18} aria-hidden /> Añadir contacto
        </button>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        onCancel={() => !isPending && setPendingDelete(null)}
        onConfirm={confirmRemove}
        busy={isPending}
        tone="danger"
        icon={<IconTrash size={22} stroke={2.2} aria-hidden />}
        title="¿Borrar contacto de confianza?"
        description={
          pendingDelete ? (
            <p>
              <strong className="font-semibold text-ink-primary">{pendingDelete.name}</strong>
              {" "}desaparecerá del botón SOS y no podrás llamarle desde un momento crítico
              hasta volver a añadirle.
            </p>
          ) : null
        }
        confirmLabel="Sí, borrar"
        cancelLabel="Mantener"
      />
    </section>
  );
}
