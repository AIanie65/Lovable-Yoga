import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Leaf,
  Flame,
  Waves,
  Repeat,
  Sparkles,
  HeartHandshake,
  Instagram,
  MessageCircle,
  MapPin,
  Mail,
  Calendar,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "YogaLounge Erfurt – Yoga, das dich abholt." },
      {
        name: "description",
        content:
          "Ruhige Kurse, klare Orientierung und ein Ort zum Ankommen – mitten in Erfurt. Stundenplan & Buchung direkt online.",
      },
      { property: "og:title", content: "YogaLounge Erfurt" },
      {
        property: "og:description",
        content:
          "Yoga, Meditation und achtsame Bewegung in Erfurt. Ohne Leistungsdruck. Direkt buchbar.",
      },
    ],
  }),
});

// ==== Platzhalter ====
const BSPORT_COMPANY_ID = 5637;
const BSPORTS_LINK = "https://backoffice.bsport.io/m/YogaLounge%20Erfurt/5637/";
const INSTAGRAM_LINK = "https://instagram.com/yogalounge_erfurt";
const FACEBOOK_LINK = "https://www.facebook.com/YogaLoungeErfurt/";
const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VazOMXAL7UVYgqos6V1G";
const EMAIL = "kathrin@seemannsyoga.de";
const STUDIO_IMAGE = "https://www.seemannsyoga.de/media/20230427_114941.jpg";
const STUDIO_DETAIL_IMAGE = "https://www.seemannsyoga.de/media/20230427_115127.jpg";

const nav = [
  { href: "#start", label: "Start" },
  { href: "#einstieg", label: "Einstieg" },
  { href: "#stundenplan", label: "Stundenplan" },
  { href: "#angebote", label: "Angebote" },
  { href: "#kooperationen", label: "Kooperationen" },
  { href: "#kontakt", label: "Kontakt" },
];

const needs = [
  {
    icon: Leaf,
    title: "Sanft & ruhig",
    desc: "Zum Ankommen, Runterfahren und den Körper freundlich bewegen.",
  },
  {
    icon: Flame,
    title: "Aktiv & stärkend",
    desc: "Für Wärme, Kraft und Stabilität – ohne Leistungsdruck.",
  },
  {
    icon: Waves,
    title: "Meditation & Atem",
    desc: "Für einen leiseren Kopf und bewusstes, tiefes Atmen.",
  },
  {
    icon: Repeat,
    title: "Beweglich werden",
    desc: "Für alle, die geschmeidiger und freier werden möchten.",
  },
  {
    icon: Sparkles,
    title: "Workshops & Events",
    desc: "Besondere Formate, Reihen und thematische Abende.",
  },
  {
    icon: HeartHandshake,
    title: "Regelmäßig üben",
    desc: "Karten und Serien, die dich langfristig begleiten.",
  },
];

// ---------- kleine Bausteine ----------

function CTA({
  href,
  children,
  variant = "primary",
  className = "",
  target,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "dark";
  className?: string;
  target?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium transition-all duration-300";
  const styles =
    variant === "primary"
      ? "text-primary-foreground shadow-[0_14px_36px_-14px_oklch(0.72_0.16_55/0.65)] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-14px_oklch(0.72_0.16_55/0.75)]"
      : variant === "dark"
        ? "bg-foreground text-background hover:bg-foreground/90"
        : "border border-foreground/15 bg-background/70 text-foreground backdrop-blur hover:bg-background";
  const bg = variant === "primary" ? { background: "var(--gradient-warm)" } : undefined;
  return (
    <a
      href={href}
      target={target}
      rel={target ? "noreferrer" : undefined}
      className={`${base} ${styles} ${className}`}
      style={bg}
    >
      {children}
    </a>
  );
}

// ---------- ruhiger, lokal erzeugter Mantra-Klang ----------

function MantraControl({ compact = false }: { compact?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    master: GainNode;
    oscillators: OscillatorNode[];
  } | null>(null);

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const now = audio.context.currentTime;
    audio.master.gain.cancelScheduledValues(now);
    audio.master.gain.setValueAtTime(audio.master.gain.value, now);
    audio.master.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    window.setTimeout(() => {
      audio.oscillators.forEach((oscillator) => oscillator.stop());
      void audio.context.close();
    }, 1300);
    audioRef.current = null;
    setPlaying(false);
  };

  const start = async () => {
    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const frequencies = [136.1, 204.15, 272.2];

    filter.type = "lowpass";
    filter.frequency.value = 720;
    filter.Q.value = 0.7;
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 2.4);
    filter.connect(master);
    master.connect(context.destination);

    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const voice = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index === 1 ? -4 : index === 2 ? 3 : 0;
      voice.gain.value = index === 0 ? 0.72 : 0.12;
      oscillator.connect(voice);
      voice.connect(filter);
      oscillator.start();
      return oscillator;
    });

    if (context.state === "suspended") await context.resume();
    audioRef.current = { context, master, oscillators };
    setPlaying(true);
  };

  useEffect(() => () => stop(), []);

  return (
    <button
      type="button"
      aria-pressed={playing}
      aria-label={playing ? "Mantra-Klang ausschalten" : "Mantra-Klang einschalten"}
      onClick={() => (playing ? stop() : void start())}
      className={`group inline-flex items-center rounded-full border border-white/20 bg-black/20 text-stone-50 shadow-lg backdrop-blur-md transition hover:bg-black/30 ${
        compact ? "gap-2 px-3 py-2 text-xs" : "gap-3 px-4 py-3 text-sm"
      }`}
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/12">
        {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        {playing && (
          <span className="absolute inset-0 animate-ping rounded-full border border-white/30" />
        )}
      </span>
      <span className="text-left leading-tight">
        <span className="block font-medium">Mantra {playing ? "an" : "aus"}</span>
        {!compact && (
          <span className="block text-[11px] text-stone-200/70">
            {playing ? "Klangraum genießen" : "zum Ankommen einschalten"}
          </span>
        )}
      </span>
    </button>
  );
}

// ---------- Mini-Guide für neue Besucher:innen ----------

type GuideAnswers = {
  experience?: "new" | "some" | "regular";
  intensity?: "gentle" | "balanced" | "active";
  goal?: "calm" | "mobility" | "strength" | "pregnancy";
};

const guideSteps = [
  {
    key: "experience" as const,
    eyebrow: "Frage 1 von 3",
    question: "Wie vertraut bist du mit Yoga?",
    options: [
      { value: "new", label: "Ganz neu", detail: "Ich möchte sicher einsteigen" },
      { value: "some", label: "Schon probiert", detail: "Ein paar Stunden kenne ich" },
      { value: "regular", label: "Regelmäßig", detail: "Ich habe eine eigene Praxis" },
    ],
  },
  {
    key: "intensity" as const,
    eyebrow: "Frage 2 von 3",
    question: "Wie möchtest du dich heute bewegen?",
    options: [
      { value: "gentle", label: "Sanft & ruhig", detail: "Loslassen und entschleunigen" },
      { value: "balanced", label: "Ausgewogen", detail: "Bewegen, atmen, ankommen" },
      { value: "active", label: "Aktiv & kraftvoll", detail: "Wärme und Energie spüren" },
    ],
  },
  {
    key: "goal" as const,
    eyebrow: "Frage 3 von 3",
    question: "Was wünschst du dir gerade am meisten?",
    options: [
      { value: "calm", label: "Mehr Ruhe", detail: "Kopf und Nervensystem entlasten" },
      { value: "mobility", label: "Mehr Beweglichkeit", detail: "Den Körper wieder freier spüren" },
      { value: "strength", label: "Mehr Kraft", detail: "Stabilität und Energie aufbauen" },
      { value: "pregnancy", label: "Schwangerschaft", detail: "Sicher und begleitet üben" },
    ],
  },
];

function getCourseRecommendation(answers: Required<GuideAnswers>) {
  if (answers.goal === "pregnancy") {
    return {
      title: "Schwangerschaftsyoga",
      text: "Eine speziell begleitete Praxis für diese besondere Zeit. Bitte prüfe vorab den aktuellen Kurszeitraum und freie Plätze im Stundenplan.",
    };
  }
  if (answers.goal === "calm") {
    return {
      title: answers.intensity === "active" ? "Slow Flow & Entspannung" : "Yin Yoga & Meditation",
      text: "Ruhige Bewegungen, längeres Verweilen und bewusster Atem helfen dir, aus dem Alltag auszusteigen und wieder bei dir anzukommen.",
    };
  }
  if (answers.goal === "mobility") {
    return {
      title: answers.intensity === "gentle" ? "Yin Yoga" : "Hatha Yoga",
      text: "Diese Richtung verbindet achtsames Dehnen mit stabiler Ausrichtung. Du kannst Beweglichkeit entwickeln, ohne dich unter Leistungsdruck zu setzen.",
    };
  }
  if (answers.intensity === "active" || answers.goal === "strength") {
    return {
      title: answers.experience === "new" ? "Hatha Yoga für Anfänger:innen" : "Vinyasa Flow",
      text:
        answers.experience === "new"
          ? "Ein klar angeleiteter Einstieg, der Kraft und Stabilität aufbaut und dir genug Zeit für eine sichere Ausrichtung lässt."
          : "Eine fließende, kräftigende Praxis, die Bewegung und Atem verbindet und neue Energie entstehen lässt.",
    };
  }
  return {
    title: answers.experience === "new" ? "Yoga für Anfänger:innen" : "Hatha Yoga",
    text: "Eine ausgewogene Praxis mit Bewegung, Atem und Ruhe. Sie gibt dir Orientierung und lässt gleichzeitig Raum für dein eigenes Tempo.",
  };
}

function NewHereGuide() {
  const [answers, setAnswers] = useState<GuideAnswers>({});
  const stepIndex = answers.experience ? (answers.intensity ? (answers.goal ? 3 : 2) : 1) : 0;
  const recommendation =
    stepIndex === 3 ? getCourseRecommendation(answers as Required<GuideAnswers>) : null;

  const choose = (key: keyof GuideAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const goBack = () => {
    if (stepIndex === 2) setAnswers({ experience: answers.experience });
    if (stepIndex === 1) setAnswers({});
  };

  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-foreground/10 bg-primary text-primary-foreground shadow-[0_30px_80px_-45px_oklch(0.28_0.07_46/0.7)]">
      <div className="grid md:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-white/10 p-7 md:border-r md:border-b-0 md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-xl italic">Neu hier?</p>
              <p className="text-xs text-primary-foreground/65">Finde deinen passenden Einstieg</p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-primary-foreground/75">
            Drei kurze Fragen geben dir eine ehrliche Orientierung. Aktuelle Termine, Preise und
            freie Plätze kommen anschließend direkt von bSport.
          </p>
          <p className="mt-4 text-[11px] leading-relaxed text-primary-foreground/50">
            Deine Auswahl bleibt in deinem Browser und wird nicht gespeichert.
          </p>
        </div>

        <div className="bg-black/[0.08] p-7 md:p-8">
          {recommendation ? (
            <div aria-live="polite">
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/55">
                Deine Empfehlung
              </p>
              <div className="mt-3 rounded-2xl bg-white/[0.1] p-5">
                <h3 className="font-serif text-3xl italic">{recommendation.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/78">
                  {recommendation.text}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="#stundenplan"
                  className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground"
                >
                  Passende Termine ansehen <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setAnswers({})}
                  className="rounded-full border border-white/15 px-4 py-3 text-sm"
                >
                  Neu starten
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                className="flex items-center gap-2"
                aria-label={`Schritt ${stepIndex + 1} von 3`}
              >
                {[0, 1, 2].map((item) => (
                  <span
                    key={item}
                    className={`h-1.5 flex-1 rounded-full ${item <= stepIndex ? "bg-white/75" : "bg-white/15"}`}
                  />
                ))}
              </div>
              <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-primary-foreground/55">
                {guideSteps[stepIndex].eyebrow}
              </p>
              <h3 className="mt-2 font-serif text-2xl italic">{guideSteps[stepIndex].question}</h3>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {guideSteps[stepIndex].options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => choose(guideSteps[stepIndex].key, option.value)}
                    className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.14]"
                  >
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-primary-foreground/58">
                      {option.detail}
                    </span>
                  </button>
                ))}
              </div>
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="mt-4 text-xs text-primary-foreground/60 underline decoration-white/25 underline-offset-4"
                >
                  Zurück zur vorherigen Frage
                </button>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3 text-xs text-primary-foreground/65">
            <span>Unsicher?</span>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/30 underline-offset-4"
            >
              Persönlich über WhatsApp fragen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- bSport widget mount ----------

declare global {
  interface Window {
    BsportWidget?: { mount: (cfg: unknown) => void };
  }
}

function BsportCalendar() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // CDN einbinden (idempotent)
    if (!document.getElementById("bsport-widget-cdn")) {
      const s = document.createElement("script");
      s.id = "bsport-widget-cdn";
      s.src = "https://cdn.bsport.io/scripts/widget.js";
      s.async = true;
      document.head.appendChild(s);
    }

    const tryMount = (attempt = 1) => {
      if (cancelled || attempt > 60) return;
      if (!window.BsportWidget) {
        setTimeout(() => tryMount(attempt + 1), 120);
        return;
      }
      try {
        window.BsportWidget.mount({
          parentElement: "bsport-widget-661068",
          companyId: BSPORT_COMPANY_ID,
          franchiseId: null,
          dialogMode: 1,
          widgetType: "calendar",
          showFab: false,
          fullScreenPopup: false,
          styles: undefined,
          config: { calendar: {} },
        });
        setReady(true);
      } catch {
        /* stiller Fallback – Platzhalter bleibt */
      }
    };
    tryMount();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative">
      {!ready && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-[1.6rem] bg-gradient-to-b from-background to-secondary/60 text-center">
          <div
            className="h-10 w-10 animate-pulse rounded-full"
            style={{ background: "var(--gradient-warm)" }}
          />
          <p className="max-w-xs px-6 text-sm text-foreground/60">
            Hier lädt gleich der aktuelle Stundenplan.
            <br />
            Alle Kurse, freien Plätze und Preise findest du direkt hier.
          </p>
          <a
            href={BSPORTS_LINK}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background px-5 py-2 text-sm font-medium"
          >
            Direkt bei bSport öffnen <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
      <div
        id="bsport-widget-661068"
        className="min-h-[720px] w-full rounded-[1.6rem] bg-background"
      />
    </div>
  );
}

// ---------- Seite ----------

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Wasserzeichen-Logo (dezent, dekorativ) */}
      <div
        aria-hidden
        className="pointer-events-none fixed -right-32 top-1/2 -z-0 hidden -translate-y-1/2 select-none font-serif text-[22rem] italic leading-none text-foreground/[0.03] lg:block"
        style={{ letterSpacing: "-0.06em" }}
      >
        yl
      </div>

      {/* ============== HERO ============== */}
      <section id="start" className="relative overflow-hidden px-6 pb-24 pt-16 sm:pb-32 sm:pt-24">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-cream)" }} />
        <div
          aria-hidden
          className="absolute -right-40 -top-40 -z-10 h-[560px] w-[560px] rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--glow-earth)" }}
        />
        <div
          aria-hidden
          className="absolute -left-32 top-1/2 -z-10 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.74 0.07 65 / 0.35), transparent 70%)",
          }}
        />

        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl font-serif text-lg italic text-primary-foreground shadow-[0_10px_24px_-10px_oklch(0.72_0.16_55/0.7)]"
                style={{ background: "var(--gradient-warm)" }}
              >
                yl
              </span>
              <div className="text-xs uppercase tracking-[0.28em] text-foreground/55">
                YogaLounge · Erfurt
              </div>
            </div>

            <h1
              className="mt-8 font-serif text-[3rem] leading-[1.02] tracking-tight sm:text-6xl md:text-[4.5rem]"
              style={{ fontWeight: 400 }}
            >
              Ankommen.{" "}
              <span
                className="italic"
                style={{
                  background: "var(--gradient-warm)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Durchatmen.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-foreground/70">
              Ein warmer Raum mitten in Erfurt. Für Bewegung, Stille und den Moment, in dem du
              wieder bei dir ankommst. Du musst nichts können. Du darfst einfach da sein.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <CTA href="#stundenplan">Stundenplan ansehen</CTA>
              <CTA href={BSPORTS_LINK} variant="dark" target="_blank">
                Kurs buchen
              </CTA>
              <CTA href="#einstieg" variant="ghost">
                Neu hier?
              </CTA>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.22em] text-foreground/50">
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--gradient-warm)" }}
                />
                Neuwerkstraße 31
              </span>
              <span>· ohne Leistungsdruck</span>
              <span>· für jedes Level</span>
            </div>
          </div>

          {/* Rechte Kachel – Studio, Licht und ein ruhiger Klangraum */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.25rem] bg-stone-900 shadow-[0_45px_110px_-45px_oklch(0.25_0.06_45/0.75)]">
              <img
                src={STUDIO_IMAGE}
                alt="Der echte Yogaraum der YogaLounge Erfurt"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-stone-950/10 via-stone-950/5 to-stone-950/80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,transparent_10%,rgba(35,18,8,0.2)_70%)]" />
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-100 backdrop-blur">
                    YogaLounge
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-100 backdrop-blur">
                    Erfurt
                  </span>
                </div>
                <div>
                  <MantraControl />
                  <p className="mt-6 font-serif text-3xl italic text-stone-50">
                    Lass den Tag
                    <br />
                    für einen Moment los.
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-200/80">
                    Atme ein. Atme aus. Alles Weitere darf warten.
                  </p>
                </div>
              </div>
            </div>

            {/* schwebende „Live-Info“-Kachel */}
            <a
              href="#stundenplan"
              className="absolute -bottom-6 -left-4 hidden max-w-[240px] rounded-2xl border border-foreground/8 bg-background/95 p-4 shadow-[0_20px_50px_-25px_oklch(0.55_0.15_55/0.4)] backdrop-blur sm:block"
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-widest text-foreground/50">
                    Live
                  </div>
                  <div className="truncate text-sm font-medium">Aktuelle Kurse & freie Plätze</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============== EINSTIEG ============== */}
      <section id="einstieg" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-foreground/50">
                Neu hier?
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] md:text-5xl">
                Such dir den Kurs,
                <br />
                <span className="italic">der heute zu dir passt.</span>
              </h2>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-foreground/70">
              In der YogaLounge findest du Yoga, Meditation, Entspannung und achtsame Bewegung –
              ohne Vergleich, ohne komplizierte Hürden. Wähle nach Gefühl, nicht nach Stil.
            </p>
          </div>

          <NewHereGuide />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map(({ icon: Icon, title, desc }) => (
              <a
                key={title}
                href="#stundenplan"
                className="group relative overflow-hidden rounded-3xl border border-foreground/8 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_oklch(0.55_0.15_55/0.4)]"
              >
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: "var(--gradient-warm)" }}
                />
                <div
                  className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="relative font-serif text-2xl" style={{ fontWeight: 500 }}>
                  {title}
                </h3>
                <p className="relative mt-2 text-[15px] leading-relaxed text-foreground/70">
                  {desc}
                </p>
                <div className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition group-hover:text-foreground">
                  Passende Stunde finden <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============== STUNDENPLAN / bSport ============== */}
      <section
        id="stundenplan"
        className="px-6 py-24"
        style={{ background: "var(--gradient-cream)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-foreground/50">
              Stundenplan & Buchung
            </span>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Alle Zeiten, <span className="italic">freien Plätze und Preise.</span>
            </h2>
            <p className="mt-4 text-foreground/70">
              Wähle deine Stunde und buche direkt hier. Rabattcodes und Events laufen ebenfalls über
              das Buchungssystem.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-foreground/8 bg-card p-2 shadow-[0_40px_100px_-50px_oklch(0.55_0.15_55/0.45)] sm:p-3">
            <BsportCalendar />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-foreground/60">
            <span>Widget lädt nicht?</span>
            <a
              href={BSPORTS_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-foreground/15 bg-background px-5 py-2 font-medium text-foreground transition hover:bg-secondary"
            >
              Direkt bei bSport buchen <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============== ANGEBOTE ============== */}
      <section id="angebote" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.25em] text-foreground/50">
                Angebote
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                Was dich hier <span className="italic">erwartet.</span>
              </h2>
            </div>
            <CTA href={BSPORTS_LINK} target="_blank" variant="ghost">
              Alles im Stundenplan ansehen
            </CTA>
          </div>

          <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2">
            {/* großes Feature */}
            <div className="relative overflow-hidden rounded-3xl p-8 text-primary-foreground md:col-span-4 md:row-span-2">
              <img
                src={STUDIO_DETAIL_IMAGE}
                alt="Einblick in die Räume der YogaLounge Erfurt"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-stone-950/85 via-stone-900/68 to-stone-800/35" />
              <span className="relative text-[11px] uppercase tracking-[0.25em] text-stone-100/80">
                Kern
              </span>
              <h3 className="relative mt-3 font-serif text-4xl leading-tight text-stone-50 md:text-5xl">
                Yoga-Kurse
                <br />
                <span className="italic">für Ruhe, Kraft & einen Moment bei dir.</span>
              </h3>
              <p className="relative mt-5 max-w-md text-stone-100/90">
                Laufende Kurse in unterschiedlichen Stilen und Intensitäten. Such dir aus, was heute
                passt – im Stundenplan siehst du alles auf einen Blick.
              </p>
              <div className="relative mt-8">
                <a
                  href="#stundenplan"
                  className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground"
                >
                  Zum Stundenplan <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* kleine Kacheln */}
            {[
              {
                title: "Meditation & Entspannung",
                desc: "Für einen leiseren Kopf und bewussteres Atmen.",
              },
              {
                title: "Workshops & Events",
                desc: "Besondere Formate, Reihen und thematische Abende.",
              },
              {
                title: "Massage",
                desc: "Achtsame Körperarbeit – Buchung läuft über bSport.",
              },
              {
                title: "Kooperationen & Soli",
                desc: "Gemeinsam mit Partner:innen. Zugänglich für viele.",
              },
            ].map((t) => (
              <a
                key={t.title}
                href="#stundenplan"
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-foreground/8 bg-card p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_oklch(0.55_0.15_55/0.35)] md:col-span-2"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-foreground/50">
                    Angebot
                  </span>
                  <h3 className="mt-2 font-serif text-2xl" style={{ fontWeight: 500 }}>
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{t.desc}</p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition group-hover:text-foreground">
                  Ansehen <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============== KOOPERATIONEN / RABATTE / KK ============== */}
      <section
        id="kooperationen"
        className="px-6 py-24"
        style={{
          background: "linear-gradient(180deg, oklch(0.98 0.015 82), oklch(0.99 0.008 85))",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-foreground/50">
                Haltung
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] md:text-5xl">
                Kooperationen,
                <br />
                Rabatte & <span className="italic">Krankenkasse.</span>
              </h2>
              <p className="mt-6 max-w-md text-foreground/70">
                Yoga darf leicht zugänglich sein. Wir arbeiten mit ausgewählten Partner:innen, wenn
                es menschlich, fachlich und gemeinschaftlich passt.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Kooperationen & guter Zweck",
                  body: "Zusammenarbeit mit Erfurter Initiativen und Projekten – für eine offene, tragende Community.",
                },
                {
                  title: "Rabatte & Soli-Plätze",
                  body: "Aktuelle Rabattcodes, Aktionen und Soli-Möglichkeiten laufen über bSport bzw. auf Anfrage – transparent und ohne komplizierte Hürden.",
                },
                {
                  title: "Krankenkasse",
                  body: "Einige Kursformate können je nach Krankenkasse bezuschusst werden. Ob dein Kurs geeignet ist und welche Nachweise du brauchst, klären wir vor der Buchung.",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="rounded-3xl border border-foreground/8 bg-card p-6 md:p-7"
                >
                  <h3 className="font-serif text-2xl" style={{ fontWeight: 500 }}>
                    {b.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== ATMOSPHÄRE ============== */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-foreground/50">
            Ein Ort zum Ankommen
          </span>
          <p className="mt-6 font-serif text-3xl leading-[1.25] text-foreground/85 md:text-4xl">
            <span className="italic">Kein Leistungsdruck.</span> Auch für Anfänger:innen. Warmes
            Studio, achtsame Begleitung, <span className="italic">Gemeinschaft ohne Zwang.</span>
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm uppercase tracking-[0.22em] text-foreground/50">
            <span>ruhig</span>
            <span className="text-foreground/20">·</span>
            <span>offen</span>
            <span className="text-foreground/20">·</span>
            <span>achtsam</span>
            <span className="text-foreground/20">·</span>
            <span>gendergerecht</span>
            <span className="text-foreground/20">·</span>
            <span>professionell</span>
          </div>
        </div>
      </section>

      {/* ============== AKTUELLES / SOCIAL ============== */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl p-8 text-primary-foreground"
            style={{
              background: "linear-gradient(160deg, oklch(0.7 0.15 155), oklch(0.55 0.14 155))",
            }}
          >
            <MessageCircle className="h-6 w-6 opacity-90" />
            <h3 className="mt-6 font-serif text-3xl leading-tight">WhatsApp-Kanal</h3>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Freie Plätze, Neuigkeiten und besondere Termine – direkt aufs Handy.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              Kanal folgen <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </a>

          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-foreground/8 bg-card p-8"
          >
            <Instagram className="h-6 w-6 text-foreground/70" />
            <h3 className="mt-6 font-serif text-3xl leading-tight">Instagram</h3>
            <p className="mt-2 text-sm text-foreground/65">
              Eindrücke aus dem Studio, Momente aus Kursen und Ankündigungen.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/75 transition group-hover:text-foreground">
              Folgen <ArrowRight className="h-4 w-4" />
            </div>
          </a>

          <a
            href={FACEBOOK_LINK}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-foreground/8 bg-card p-8"
          >
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-sm font-semibold text-background"
            >
              f
            </span>
            <h3 className="mt-5 font-serif text-3xl leading-tight">Facebook</h3>
            <p className="mt-2 text-sm text-foreground/65">
              Neuigkeiten, Veranstaltungen und Einblicke aus der YogaLounge.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/75 transition group-hover:text-foreground">
              Profil öffnen <ArrowRight className="h-4 w-4" />
            </div>
          </a>
        </div>
      </section>

      {/* ============== KONTAKT ============== */}
      <section id="kontakt" className="px-6 pb-32">
        <div
          className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-8 py-14 text-primary-foreground sm:px-14 sm:py-20"
          style={{ background: "var(--gradient-warm)" }}
        >
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <span className="text-[11px] uppercase tracking-[0.28em] text-primary-foreground/80">
                Kontakt
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Komm vorbei –<br />
                <span className="italic">oder buche direkt online.</span>
              </h2>
              <div className="mt-8 space-y-3 text-primary-foreground/90">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    YogaLounge Erfurt
                    <br />
                    Neuwerkstraße 31 · 99084 Erfurt
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{EMAIL}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="#stundenplan"
                className="inline-flex items-center justify-between rounded-2xl bg-background px-6 py-4 text-foreground shadow-lg"
              >
                <span className="font-medium">Zum Stundenplan</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={BSPORTS_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-2xl bg-foreground/90 px-6 py-4 text-background"
              >
                <span className="font-medium">Kurs buchen</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-2xl border border-primary-foreground/30 px-6 py-4"
              >
                <span className="font-medium">WhatsApp-Kanal folgen</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <div className="mt-2 flex gap-3 text-sm text-primary-foreground/80">
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  Instagram
                </a>
                <span>·</span>
                <a
                  href={FACEBOOK_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-foreground/10 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-foreground/55 sm:flex-row">
          <div className="flex items-center gap-2">
            <span
              className="grid h-6 w-6 place-items-center rounded-md font-serif text-[11px] italic text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
            >
              yl
            </span>
            © {new Date().getFullYear()} YogaLounge Erfurt
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Impressum
            </a>
            <a href="#" className="hover:text-foreground">
              Datenschutz
            </a>
            <a href="#" className="hover:text-foreground">
              AGB
            </a>
          </div>
        </div>
      </footer>

      {/* ============== FLOATING NAV ============== */}
      <FloatingNav />
    </div>
  );
}

function FloatingNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop – schwebende Pille unten */}
      <nav
        aria-label="Sprungmarken"
        className="fixed inset-x-0 bottom-3 z-40 mx-auto hidden w-fit lg:block"
      >
        <div className="flex items-center gap-0.5 rounded-full border border-foreground/8 bg-background/88 p-1 pl-2.5 shadow-[0_16px_45px_-28px_oklch(0.31_0.07_46/0.65)] backdrop-blur-xl">
          <span className="px-1.5 font-serif text-sm italic text-foreground/85">YogaLounge</span>
          <span className="mx-0.5 h-4 w-px bg-foreground/10" />
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-2.5 py-1.5 text-xs text-foreground/75 transition hover:bg-secondary hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
          <a
            href={BSPORTS_LINK}
            target="_blank"
            rel="noreferrer"
            className="ml-0.5 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-primary-foreground"
            style={{ background: "var(--gradient-warm)" }}
          >
            Buchen <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </nav>

      {/* Mobile – Buchen-Bar + Menü-Trigger */}
      <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        <div className="flex items-center gap-1.5 rounded-full border border-foreground/8 bg-background/95 p-1 pl-3 shadow-[0_16px_40px_-24px_oklch(0.31_0.07_46/0.65)] backdrop-blur-xl">
          <a href="#stundenplan" className="flex-1 truncate text-xs font-medium text-foreground/85">
            Stundenplan · Buchen
          </a>
          <a
            href={BSPORTS_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-3 py-2 text-xs font-medium text-primary-foreground"
            style={{ background: "var(--gradient-warm)" }}
          >
            Kurs buchen
          </a>
          <button
            aria-label="Menü öffnen"
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full border border-foreground/10"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-foreground/80" />
              <span className="block h-0.5 w-4 bg-foreground/80" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sheet */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Menü schließen"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
          />
          <div className="absolute inset-x-3 bottom-3 rounded-3xl border border-foreground/8 bg-background p-4 shadow-2xl">
            <div className="flex items-center justify-between px-2 pb-3">
              <span className="font-serif text-xl italic">YogaLounge</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-foreground/10 px-3 py-1 text-xs uppercase tracking-widest text-foreground/60"
              >
                Schließen
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-secondary px-4 py-4 text-base text-foreground/85"
                >
                  {n.label}
                </a>
              ))}
            </div>
            <a
              href={BSPORTS_LINK}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl py-4 text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
            >
              Kurs bei bSport buchen <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
