import {
  IconBriefcase,
  IconHeartHandshake,
  IconMoodSmile,
  IconNotebook,
  IconSchool,
  IconScale,
  IconUsers,
  IconCircleCheck
} from "@tabler/icons-react";
import type { RecoveryDayActivity, RecoveryDayDetail } from "@renace/core";
import { formatProgramDayDate } from "@renace/core";
import { AREA_THEMES, type AreaId } from "@renace/tokens";

const ACTIVITY_ICON: Record<
  RecoveryDayActivity["kind"],
  React.ComponentType<{ size?: number; "aria-hidden"?: boolean; className?: string }>
> = {
  mood: IconMoodSmile,
  journal: IconNotebook,
  course: IconSchool,
  course_enrolled: IconSchool,
  course_completed: IconCircleCheck,
  community: IconUsers,
  job: IconBriefcase,
  consult: IconScale
};

const AREA_ICON: Record<AreaId, typeof IconHeartHandshake> = {
  emocional: IconHeartHandshake,
  fisica: IconHeartHandshake,
  juridica: IconScale,
  laboral: IconBriefcase,
  comunidad: IconUsers
};

export function RecoveryDayCard({ day }: { day: RecoveryDayDetail }) {
  return (
    <article
      className={
        "overflow-hidden rounded-[20px] border bg-elevated shadow-soft " +
        (day.isCurrent
          ? "border-brand-300 ring-1 ring-brand-200/60"
          : "border-outline-soft/70")
      }
    >
      <header
        className="flex items-start justify-between gap-3 border-b border-outline-soft/60 px-4 py-3.5"
        style={
          day.isCurrent
            ? { background: "linear-gradient(135deg, #DFF1E8 0%, #fff 70%)" }
            : undefined
        }
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="label-eyebrow text-brand-700">Día {day.day}</p>
            <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-bold text-ink-muted">
              Semana {day.week}
            </span>
            {day.isCurrent && (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-ink-inverse">
                Hoy
              </span>
            )}
          </div>
          <h2 className="mt-1 text-base font-bold capitalize text-ink-primary">
            {formatProgramDayDate(day.date)}
          </h2>
        </div>
        {day.moodEmoji && (
          <div className="flex shrink-0 flex-col items-center rounded-xl bg-canvas px-2.5 py-1.5">
            <span aria-hidden className="text-xl leading-none">
              {day.moodEmoji}
            </span>
            <span className="mt-0.5 text-[10px] font-bold text-ink-muted">{day.moodLabel}</span>
          </div>
        )}
      </header>

      <div className="flex flex-col gap-3 px-4 py-4">
        {day.moodScore !== null && (
          <MoodBlock
            score={day.moodScore}
            label={day.moodLabel ?? ""}
            emoji={day.moodEmoji ?? ""}
            note={day.moodNote}
          />
        )}

        {day.activities.length > 0 ? (
          <ul role="list" className="flex flex-col gap-2">
            {day.activities.map((activity, i) => (
              <ActivityRow key={`${activity.kind}-${activity.title}-${i}`} activity={activity} />
            ))}
          </ul>
        ) : !day.moodScore ? (
          <p className="rounded-xl border border-dashed border-outline-soft bg-canvas px-3 py-3 text-sm text-ink-subtle">
            Día en el programa sin actividad registrada. Cada día que apareces en RENACE suma a tu
            recuperación, aunque no hayas dejado huella todavía.
          </p>
        ) : null}

        {!day.hadActivity && day.moodScore === null && (
          <p className="text-xs text-ink-muted">Sin registros en este día.</p>
        )}
      </div>
    </article>
  );
}

function MoodBlock({
  score,
  label,
  emoji,
  note
}: {
  score: number;
  label: string;
  emoji: string;
  note: string | null;
}) {
  return (
    <div className="rounded-xl border border-area-emocional-border/70 bg-area-emocional-tint/40 px-3 py-3">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-lg">
          {emoji}
        </span>
        <div>
          <p className="text-sm font-bold text-area-emocional-text">Registro emocional</p>
          <p className="text-xs text-ink-subtle">
            {label} · {score}/5
          </p>
        </div>
      </div>
      {note && (
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">&ldquo;{note}&rdquo;</p>
      )}
    </div>
  );
}

function ActivityRow({ activity }: { activity: RecoveryDayActivity }) {
  const Icon = ACTIVITY_ICON[activity.kind];
  const areaTheme = activity.area ? AREA_THEMES[activity.area] : null;
  const AreaIcon = activity.area ? AREA_ICON[activity.area] : null;

  return (
    <li className="flex gap-3 rounded-xl border border-outline-soft/70 bg-canvas/80 px-3 py-2.5">
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
        style={{
          backgroundColor: areaTheme?.tint ?? "#F4F6F2",
          color: areaTheme?.core ?? "#5C6759"
        }}
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-bold text-ink-primary">{activity.title}</p>
          {activity.time && (
            <span className="text-[10px] font-semibold text-ink-muted">{activity.time}</span>
          )}
        </div>
        {activity.detail && (
          <p className="mt-0.5 text-xs leading-relaxed text-ink-subtle">{activity.detail}</p>
        )}
        {areaTheme && AreaIcon && (
          <span
            className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{
              backgroundColor: areaTheme.tint,
              color: areaTheme.text
            }}
          >
            <AreaIcon size={10} aria-hidden />
            {areaTheme.label}
          </span>
        )}
      </div>
    </li>
  );
}
