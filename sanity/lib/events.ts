import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

// After the team publishes a change in /studio, pages pick it up within this many seconds.
export const EVENTS_REVALIDATE_SECONDS = 60;

const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

const imageBuilder = createImageUrlBuilder({ projectId: projectId || "unset", dataset });

/* ── Types ── */

export interface SanityImage {
  asset?: {
    _id: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number; aspectRatio: number } };
  };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export type EventMode = "in-person" | "online" | "hybrid";

export interface EventSummary {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  summary?: string;
  poster?: SanityImage;
  startsAt: string;
  endsAt?: string;
  mode?: EventMode;
  venueName?: string;
  onlinePlatform?: string;
  price?: string;
  featured?: boolean;
  registrationOpen?: boolean;
  registrationDeadline?: string;
}

export interface EventDetail extends EventSummary {
  _updatedAt: string;
  description?: PortableTextBlock[];
  highlights?: string[];
  speakers?: { _key: string; name: string; role?: string; photo?: SanityImage }[];
  venueAddress?: string;
  mapLink?: string;
  googleFormUrl?: string;
  seatsNote?: string;
}

export interface EventRegistration {
  title: string;
  startsAt: string;
  endsAt?: string;
  registrationOpen?: boolean;
  registrationDeadline?: string;
  googleFormUrl?: string;
  whatsappLink?: string;
  communityName?: string;
  communityPhoto?: SanityImage;
  communityDescription?: string;
}

/* ── Queries ── */

const IMAGE = `{ alt, hotspot, crop, asset->{ _id, metadata { lqip, dimensions } } }`;

const SUMMARY_FIELDS = `
  _id, title, "slug": slug.current, category, summary, poster${IMAGE},
  startsAt, endsAt, mode, venueName, onlinePlatform, price, featured,
  registrationOpen, registrationDeadline`;

const PUBLISHED_EVENTS = `_type == "event" && defined(slug.current) && defined(startsAt)`;

const EVENTS_QUERY = `*[${PUBLISHED_EVENTS}] | order(startsAt asc) { ${SUMMARY_FIELDS} }`;

const EVENT_QUERY = `*[${PUBLISHED_EVENTS} && slug.current == $slug][0] {
  ${SUMMARY_FIELDS}, _updatedAt, description, highlights,
  speakers[]{ _key, name, role, photo${IMAGE} },
  venueAddress, mapLink, googleFormUrl, seatsNote
}`;

// Kept separate so the WhatsApp details are only sent to people who have registered.
const EVENT_REGISTRATION_QUERY = `*[${PUBLISHED_EVENTS} && slug.current == $slug][0] {
  title, startsAt, endsAt, registrationOpen, registrationDeadline, googleFormUrl,
  whatsappLink, communityName, communityPhoto${IMAGE}, communityDescription
}`;

const EVENT_SLUGS_QUERY = `*[${PUBLISHED_EVENTS}]{ "slug": slug.current, _updatedAt }`;

async function sanityFetch<T>(query: string, params: Record<string, string>, fallback: T): Promise<T> {
  // Before the Sanity project is set up there is nothing to load.
  if (!client) return fallback;
  const result = await client.fetch<T | null>(query, params, {
    next: { revalidate: EVENTS_REVALIDATE_SECONDS, tags: ["event"] },
  });
  return result ?? fallback;
}

export function getEvents() {
  return sanityFetch<EventSummary[]>(EVENTS_QUERY, {}, []);
}

export function getEvent(slug: string) {
  return sanityFetch<EventDetail | null>(EVENT_QUERY, { slug }, null);
}

export function getEventRegistration(slug: string) {
  return sanityFetch<EventRegistration | null>(EVENT_REGISTRATION_QUERY, { slug }, null);
}

export function getEventSlugs() {
  return sanityFetch<{ slug: string; _updatedAt: string }[]>(EVENT_SLUGS_QUERY, {}, []);
}

/* ── Images ── */

// Whole image, scaled to fit the width. Used for posters, which must not be cropped.
export function imageUrl(source: SanityImage, width: number) {
  return imageBuilder.image(source).width(width).fit("max").auto("format").url();
}

// Square crop around the hotspot. Used for speaker and community photos.
export function squareImageUrl(source: SanityImage, size: number) {
  return imageBuilder.image(source).width(size).height(size).fit("crop").auto("format").url();
}

/* ── Dates and status ── */

const TIME_ZONE = "Asia/Kolkata";
const dayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: TIME_ZONE,
});
const shortDayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: TIME_ZONE });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE });
const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE });
const badgeDayFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: TIME_ZONE });
const badgeMonthFormat = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: TIME_ZONE });

export function formatEventDate(event: Pick<EventSummary, "startsAt" | "endsAt">) {
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : null;
  if (!end) return { date: dayFormat.format(start), time: `${timeFormat.format(start)} IST` };
  if (dayKeyFormat.format(start) === dayKeyFormat.format(end)) {
    return { date: dayFormat.format(start), time: `${timeFormat.format(start)} – ${timeFormat.format(end)} IST` };
  }
  return {
    date: `${shortDayFormat.format(start)} – ${dayFormat.format(end)}`,
    time: `Starts ${timeFormat.format(start)} IST`,
  };
}

export function dateBadge(startsAt: string) {
  const start = new Date(startsAt);
  return { day: badgeDayFormat.format(start), month: badgeMonthFormat.format(start).toUpperCase() };
}

export const MODE_LABELS: Record<EventMode, string> = {
  "in-person": "In person",
  online: "Online",
  hybrid: "Hybrid",
};

export function eventLocation(event: Pick<EventSummary, "mode" | "venueName" | "onlinePlatform">) {
  if (event.mode === "online") return event.onlinePlatform ? `Online · ${event.onlinePlatform}` : "Online";
  if (event.mode === "hybrid") return `${event.venueName ?? "Venue TBA"} + online`;
  return event.venueName ?? "Venue TBA";
}

// "Add to Google Calendar" link. Events without an end time are assumed to last two hours.
export function googleCalendarUrl(event: EventSummary & { venueAddress?: string }) {
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: `${event.summary ?? ""}\n\nhttps://neurostack.in/events/${event.slug}`.trim(),
    location: event.mode === "online" ? eventLocation(event) : [event.venueName, event.venueAddress].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// What people see right after registering.
export interface CommunityInvite {
  link: string;
  name?: string;
  photoUrl?: string;
  description?: string;
}

export function communityInvite(event: EventRegistration): CommunityInvite | null {
  if (!event.whatsappLink) return null;
  return {
    link: event.whatsappLink,
    name: event.communityName,
    photoUrl: event.communityPhoto?.asset ? squareImageUrl(event.communityPhoto, 160) : undefined,
    description: event.communityDescription,
  };
}

export function isUpcoming(event: Pick<EventSummary, "startsAt" | "endsAt">, now = new Date()) {
  return new Date(event.endsAt ?? event.startsAt) >= now;
}

export function isRegistrationOpen(
  event: Pick<EventSummary, "startsAt" | "endsAt" | "registrationOpen" | "registrationDeadline">,
  now = new Date(),
) {
  if (event.registrationOpen === false) return false;
  return new Date(event.registrationDeadline ?? event.endsAt ?? event.startsAt) > now;
}
