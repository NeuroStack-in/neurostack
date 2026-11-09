import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import AnimateOnScroll from "../../components/AnimateOnScroll";
import EventPoster from "../EventPoster";
import RegistrationCard from "./RegistrationCard";
import RegistrationForm from "./RegistrationForm";
import { ArrowIcon, CalendarIcon, CheckIcon, ClockIcon, PinIcon } from "../icons";
import { loadGoogleForm, normalizeFormUrl, toPublicForm } from "@/lib/googleForm";
import {
  MODE_LABELS,
  eventLocation,
  formatEventDate,
  getEvent,
  getEventSlugs,
  googleCalendarUrl,
  imageUrl,
  isRegistrationOpen,
  isUpcoming,
  squareImageUrl,
  type EventDetail,
} from "@/sanity/lib/events";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  const url = `https://neurostack.in/events/${event.slug}`;
  const image = event.poster?.asset ? imageUrl(event.poster, 1200) : "/logo.png";
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: event.title, description: event.summary, images: [{ url: image, alt: event.title }] },
    twitter: { card: "summary_large_image", title: event.title, description: event.summary, images: [image] },
  };
}

const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-gray-600 text-base leading-relaxed mb-4">{children}</p>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-primary mt-8 mb-3">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4 marker:text-accent">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-2 text-gray-600 mb-4 marker:text-accent marker:font-semibold">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">
        {children}
      </a>
    ),
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-[2px] bg-accent rounded-full" />
      <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">{children}</span>
    </div>
  );
}

// Structured data so the event can appear in Google's event listings.
function eventJsonLd(event: EventDetail, open: boolean) {
  const url = `https://neurostack.in/events/${event.slug}`;
  const place = { "@type": "Place", name: event.venueName, address: event.venueAddress || event.venueName };
  const virtual = { "@type": "VirtualLocation", url };
  const priceMatch = event.price?.replace(/,/g, "").match(/\d+(\.\d+)?/);
  const free = !event.price || /free/i.test(event.price);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    url,
    startDate: event.startsAt,
    endDate: event.endsAt ?? event.startsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      event.mode === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : event.mode === "hybrid"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location: event.mode === "online" ? virtual : event.mode === "hybrid" ? [place, virtual] : place,
    image: event.poster?.asset ? [imageUrl(event.poster, 1200)] : undefined,
    organizer: { "@type": "Organization", name: "NeuroStack", url: "https://neurostack.in" },
    performer: event.speakers?.map((s) => ({ "@type": "Person", name: s.name })),
    offers: {
      "@type": "Offer",
      url,
      price: free ? 0 : priceMatch ? Number(priceMatch[0]) : undefined,
      priceCurrency: "INR",
      availability: open ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
  };
}

async function Registration({ event, open }: { event: EventDetail; open: boolean }) {
  const when = formatEventDate(event);
  const ended = !isUpcoming(event);

  if (open && event.googleFormUrl) {
    const form = await loadGoogleForm(event.googleFormUrl, { checkAccess: true });
    const fallbackUrl = normalizeFormUrl(event.googleFormUrl) ?? undefined;
    if (form.status === "ok") {
      return (
        <RegistrationForm
          slug={event.slug}
          eventTitle={event.title}
          eventDate={when.date}
          calendarUrl={googleCalendarUrl(event)}
          form={toPublicForm(form)}
          seatsNote={event.seatsNote}
          fallbackUrl={fallbackUrl}
        />
      );
    }
    if (form.status !== "closed" && fallbackUrl) {
      // The form needs a Google sign-in or uses a question type we can't show: link out instead.
      return (
        <RegistrationCard>
          <h3 className="text-2xl font-bold text-white mb-2">Register for this event</h3>
          <p className="text-white/55 text-sm leading-relaxed mb-8">
            {event.seatsNote ? `${event.seatsNote}. ` : ""}Registration for this event happens on Google Forms.
          </p>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FF6B00] text-white font-semibold py-4 rounded-full hover:bg-[#e05f00] hover:shadow-[0_8px_30px_rgba(255,107,0,0.35)] transition-all duration-300 text-sm tracking-wide uppercase flex items-center justify-center gap-2"
          >
            Open registration form
            <ArrowIcon className="w-4 h-4" />
          </a>
        </RegistrationCard>
      );
    }
  }

  return (
    <RegistrationCard>
      <h3 className="text-2xl font-bold text-white mb-2">{ended ? "This event has ended" : "Registrations are closed"}</h3>
      <p className="text-white/55 text-sm leading-relaxed mb-8">
        {ended
          ? "Thanks to everyone who joined us. Keep an eye on our events page for the next one."
          : "We're no longer taking registrations for this event. Check our other upcoming events."}
      </p>
      <Link
        href="/events"
        className="w-full text-white font-semibold py-4 rounded-full border border-white/15 hover:border-white/40 transition-all duration-300 text-sm tracking-wide uppercase flex items-center justify-center gap-2"
      >
        See all events
        <ArrowIcon className="w-4 h-4" />
      </Link>
    </RegistrationCard>
  );
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const when = formatEventDate(event);
  const open = isRegistrationOpen(event);
  const upcoming = isUpcoming(event);
  const hasDetails =
    (event.description?.length ?? 0) > 0 ||
    (event.highlights?.length ?? 0) > 0 ||
    (event.speakers?.length ?? 0) > 0 ||
    (event.mode !== "online" && Boolean(event.venueName));
  const jsonLd = JSON.stringify(eventJsonLd(event, open)).replace(/</g, "\\u003c");

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pb-20" style={{ background: "linear-gradient(135deg, #FFF5EE 0%, #FAFCFF 50%, #EEF4FF 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-10 min-w-0">
            <Link href="/events" className="hover:text-accent transition-colors duration-200 flex-shrink-0">Events</Link>
            <span aria-hidden="true">/</span>
            <span className="text-primary/70 truncate">{event.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="hero-anim-1 flex flex-wrap items-center gap-2 mb-6">
                {event.category && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">{event.category}</span>}
                {event.mode && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/5 text-primary/70 border border-primary/10">{MODE_LABELS[event.mode]}</span>}
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/5 text-primary/70 border border-primary/10">{event.price || "Free"}</span>
                {!upcoming && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500">Completed</span>}
              </div>
              <h1 className="hero-anim-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] mb-6">{event.title}</h1>
              {event.summary && <p className="hero-anim-2 text-gray-500 text-lg sm:text-xl leading-relaxed max-w-xl mb-10">{event.summary}</p>}

              <div className="hero-anim-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: <CalendarIcon className="w-5 h-5" />, label: "Date", value: when.date },
                  { icon: <ClockIcon className="w-5 h-5" />, label: "Time", value: when.time },
                  { icon: <PinIcon className="w-5 h-5" />, label: "Where", value: eventLocation(event) },
                ].map((fact) => (
                  <div key={fact.label} className="flex items-start gap-3 rounded-2xl bg-white/70 border border-primary/[0.06] p-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">{fact.icon}</div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary/40 mb-0.5">{fact.label}</p>
                      <p className="text-sm font-semibold text-primary leading-snug">{fact.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hero-anim-4 flex flex-wrap items-center gap-4">
                {open ? (
                  <a href="#register" className="inline-flex items-center gap-2 bg-accent text-white font-semibold rounded-full px-8 py-4 text-sm hover:bg-[#e05f00] hover:shadow-[0_8px_30px_rgba(255,107,0,0.35)] transition-all duration-300">
                    Register now
                    <ArrowIcon className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full px-6 py-3.5 text-sm font-semibold bg-primary/5 text-primary/60">
                    {upcoming ? "Registrations closed" : "This event has ended"}
                  </span>
                )}
                {upcoming && (
                  <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-primary border border-primary/15 hover:border-accent hover:text-accent transition-all duration-300">
                    <CalendarIcon className="w-4 h-4" />
                    Add to calendar
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <EventPoster
                poster={event.poster}
                title={event.title}
                width={1200}
                sizes="(min-width: 1024px) 480px, 100vw"
                priority
                className="aspect-[4/5] rounded-3xl shadow-[0_30px_80px_rgba(10,38,71,0.25)] max-w-md mx-auto lg:max-w-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ DETAILS + REGISTRATION ═══════════ */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-14 ${hasDetails ? "lg:grid-cols-12 lg:gap-16" : ""}`}>
          {hasDetails && (
            <div className="lg:col-span-7 space-y-16">
              {(event.description?.length ?? 0) > 0 && (
                <AnimateOnScroll animation="fade-up">
                  <SectionLabel>About</SectionLabel>
                  <h2 className="text-3xl sm:text-4xl font-black text-primary leading-[1.1] mb-8">About this event</h2>
                  <PortableText value={event.description!} components={descriptionComponents} />
                </AnimateOnScroll>
              )}

              {(event.highlights?.length ?? 0) > 0 && (
                <AnimateOnScroll animation="fade-up">
                  <SectionLabel>Highlights</SectionLabel>
                  <h2 className="text-3xl sm:text-4xl font-black text-primary leading-[1.1] mb-8">What you&apos;ll get</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.highlights!.map((point) => (
                      <li key={point} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                          <CheckIcon className="w-4 h-4" />
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed pt-0.5">{point}</span>
                      </li>
                    ))}
                  </ul>
                </AnimateOnScroll>
              )}

              {(event.speakers?.length ?? 0) > 0 && (
                <AnimateOnScroll animation="fade-up">
                  <SectionLabel>Speakers</SectionLabel>
                  <h2 className="text-3xl sm:text-4xl font-black text-primary leading-[1.1] mb-8">Who&apos;s speaking</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {event.speakers!.map((speaker) => (
                      <div key={speaker._key} className="flex items-center gap-4 rounded-2xl p-5 border border-white/10" style={{ background: "linear-gradient(160deg, #0A2647 0%, #0D3A6B 100%)" }}>
                        {speaker.photo?.asset ? (
                          <Image src={squareImageUrl(speaker.photo, 160)} alt="" width={64} height={64} unoptimized className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 text-accent text-xl font-black flex items-center justify-center flex-shrink-0">
                            {speaker.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white leading-snug">{speaker.name}</p>
                          {speaker.role && <p className="text-sm text-white/55 mt-0.5">{speaker.role}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimateOnScroll>
              )}

              {event.mode !== "online" && event.venueName && (
                <AnimateOnScroll animation="fade-up">
                  <SectionLabel>Venue</SectionLabel>
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                      <PinIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-primary">{event.venueName}</p>
                      {event.venueAddress && <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{event.venueAddress}</p>}
                    </div>
                    {event.mapLink && (
                      <a href={event.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline flex-shrink-0">
                        Open in Maps
                        <ArrowIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </AnimateOnScroll>
              )}
            </div>
          )}

          <div className={hasDetails ? "lg:col-span-5" : "max-w-2xl w-full mx-auto"}>
            <div id="register" className="scroll-mt-28">
              <Registration event={event} open={open} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
