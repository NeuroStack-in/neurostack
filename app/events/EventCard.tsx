import Link from "next/link";
import EventPoster from "./EventPoster";
import { ArrowIcon, CalendarIcon, PinIcon } from "./icons";
import {
  dateBadge,
  eventLocation,
  formatEventDate,
  isRegistrationOpen,
  type EventSummary,
} from "@/sanity/lib/events";

export function FeaturedEventCard({ event }: { event: EventSummary }) {
  const when = formatEventDate(event);
  const open = isRegistrationOpen(event);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
      style={{ background: "linear-gradient(160deg, #0A2647 0%, #0D3A6B 100%)" }}
    >
      <EventPoster
        poster={event.poster}
        title={event.title}
        width={1000}
        sizes="(min-width: 1024px) 40vw, 100vw"
        priority
        className="lg:col-span-5 aspect-[4/5] lg:aspect-auto lg:min-h-[480px]"
      />
      <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 flex flex-col justify-center relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent text-white">Featured</span>
            {event.category && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">{event.category}</span>
            )}
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] mb-4 group-hover:text-accent transition-colors duration-300">
            {event.title}
          </h3>
          {event.summary && <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">{event.summary}</p>}
          <div className="space-y-3 text-sm text-white/80 mb-10">
            <p className="flex items-center gap-3"><CalendarIcon className="w-4 h-4 text-accent" />{when.date} · {when.time}</p>
            <p className="flex items-center gap-3"><PinIcon className="w-4 h-4 text-accent" />{eventLocation(event)}</p>
          </div>
          <span className={`inline-flex items-center gap-2 font-semibold rounded-full px-7 py-3.5 text-sm transition-all duration-300 ${open ? "bg-accent text-white group-hover:bg-[#e05f00] group-hover:shadow-[0_8px_30px_rgba(255,107,0,0.35)]" : "bg-white/10 text-white/70"}`}>
            {open ? "Register now" : "View details"}
            <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EventCard({ event }: { event: EventSummary }) {
  const when = formatEventDate(event);
  const badge = dateBadge(event.startsAt);
  const open = isRegistrationOpen(event);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group h-full flex flex-col rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative">
        <EventPoster
          poster={event.poster}
          title={event.title}
          width={800}
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/5]"
        />
        <div className="absolute top-4 left-4 bg-white rounded-2xl px-3 py-2 text-center shadow-lg min-w-[56px]">
          <p className="text-xl font-black text-primary leading-none">{badge.day}</p>
          <p className="text-[10px] font-bold tracking-[0.15em] text-accent mt-1">{badge.month}</p>
        </div>
        {event.category && (
          <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-[#0A2647]/80 text-white backdrop-blur">
            {event.category}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-primary leading-snug mb-2 group-hover:text-accent transition-colors duration-300">{event.title}</h3>
        {event.summary && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{event.summary}</p>}
        <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5 text-sm text-gray-600">
          <p className="flex items-center gap-2.5"><CalendarIcon className="w-4 h-4 text-accent flex-shrink-0" />{when.date} · {when.time}</p>
          <p className="flex items-center gap-2.5"><PinIcon className="w-4 h-4 text-accent flex-shrink-0" /><span className="truncate">{eventLocation(event)}</span></p>
        </div>
        <div className="mt-auto pt-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">{event.price || "Free"}</span>
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${open ? "text-accent" : "text-gray-400"}`}>
            {open ? "Register" : "Registrations closed"}
            {open && <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PastEventCard({ event }: { event: EventSummary }) {
  return (
    <Link href={`/events/${event.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
      <EventPoster
        poster={event.poster}
        title={event.title}
        width={600}
        sizes="(min-width: 1024px) 300px, 50vw"
        className="aspect-[4/5] grayscale-[40%] group-hover:grayscale-0 transition-[filter] duration-500"
      />
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{formatEventDate(event).date}</p>
        <h3 className="text-sm font-bold text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-300">{event.title}</h3>
      </div>
    </Link>
  );
}
