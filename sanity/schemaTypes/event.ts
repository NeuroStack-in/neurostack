import { defineArrayMember, defineField, defineType } from "sanity";

const GOOGLE_FORM_HOSTS = ["docs.google.com", "forms.gle"];
const WHATSAPP_HOSTS = ["chat.whatsapp.com", "whatsapp.com", "www.whatsapp.com", "wa.me"];

function hasHost(url: string, hosts: string[]) {
  try {
    return hosts.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

type EventDoc = { mode?: string; startsAt?: string };

const FORM_PROBLEMS: Record<string, string> = {
  "sign-in-required":
    "This form asks people to sign in to Google, so the website can't save registrations into it and shows a button to Google Forms instead. To fix it, open the form → Settings → Responses: set \"Collect email addresses\" to \"Do not collect\" (add your own Email question instead) and turn off \"Limit to 1 response\". Then check this field again.",
  closed: "This form isn't accepting responses. Turn on \"Accepting responses\" in the form's Responses tab.",
};

// Asks the website whether visitors will be able to register with this form.
async function checkFormWorksOnSite(url: string | undefined) {
  if (!url || !hasHost(url, GOOGLE_FORM_HOSTS)) return true;
  try {
    const res = await fetch(`/api/events/check-form?url=${encodeURIComponent(url)}`);
    const { problem } = (await res.json()) as { problem: string | null };
    if (!problem) return true;
    if (problem.startsWith("question-type-")) {
      return "This form has a question type the website can't show (such as file upload or a grid), so the website shows a button to Google Forms instead.";
    }
    return FORM_PROBLEMS[problem] ?? true;
  } catch {
    return true; // Can't check right now; don't block the editor.
  }
}

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "when", title: "Date & venue" },
    { name: "registration", title: "Registration" },
    { name: "community", title: "WhatsApp community" },
  ],
  fields: [
    /* ── Details ── */
    defineField({
      name: "title",
      title: "Event name",
      type: "string",
      group: "details",
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "details",
      description: "Click Generate. The event page will be neurostack.in/events/<this address>.",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Event type",
      type: "string",
      group: "details",
      options: {
        list: ["Workshop", "Webinar", "Hackathon", "Meetup", "Bootcamp", "Masterclass", "Conference", "Other"],
      },
      initialValue: "Workshop",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "details",
      description: "One or two lines. Shown on the events list and in link previews on WhatsApp and LinkedIn.",
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "poster",
      title: "Poster",
      type: "image",
      group: "details",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "What the poster shows",
          type: "string",
          description: "Read aloud to visitors using screen readers.",
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "About the event",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h3" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (r) => r.uri({ scheme: ["http", "https", "mailto"] }),
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "What attendees will get",
      type: "array",
      group: "details",
      description: 'Short points, e.g. "Hands-on with RAG pipelines".',
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.max(8),
    }),
    defineField({
      name: "speakers",
      title: "Speakers",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "speaker",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", title: "Role and company", type: "string" }),
            defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "photo" } },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Feature this event",
      type: "boolean",
      group: "details",
      description: "Shows it large at the top of the events page.",
      initialValue: false,
    }),

    /* ── Date & venue ── */
    defineField({
      name: "startsAt",
      title: "Starts",
      type: "datetime",
      group: "when",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Ends",
      type: "datetime",
      group: "when",
      validation: (r) =>
        r.custom((endsAt, ctx) => {
          const startsAt = (ctx.document as EventDoc | undefined)?.startsAt;
          if (endsAt && startsAt && endsAt <= startsAt) return "End time must be after the start time.";
          return true;
        }),
    }),
    defineField({
      name: "mode",
      title: "Format",
      type: "string",
      group: "when",
      options: {
        list: [
          { title: "In person", value: "in-person" },
          { title: "Online", value: "online" },
          { title: "Hybrid", value: "hybrid" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "in-person",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "venueName",
      title: "Venue name",
      type: "string",
      group: "when",
      hidden: ({ document }) => (document as EventDoc | undefined)?.mode === "online",
      validation: (r) =>
        r.custom((value, ctx) => {
          const mode = (ctx.document as EventDoc | undefined)?.mode;
          if (mode !== "online" && !value) return "Add the venue for in-person and hybrid events.";
          return true;
        }),
    }),
    defineField({
      name: "venueAddress",
      title: "Venue address",
      type: "text",
      rows: 2,
      group: "when",
      hidden: ({ document }) => (document as EventDoc | undefined)?.mode === "online",
    }),
    defineField({
      name: "mapLink",
      title: "Google Maps link",
      type: "url",
      group: "when",
      hidden: ({ document }) => (document as EventDoc | undefined)?.mode === "online",
    }),
    defineField({
      name: "onlinePlatform",
      title: "Online platform",
      type: "string",
      group: "when",
      description: "e.g. Google Meet or Zoom. Send the joining link to registrants; don't put it here.",
      hidden: ({ document }) => (document as EventDoc | undefined)?.mode === "in-person",
    }),
    defineField({
      name: "price",
      title: "Entry fee",
      type: "string",
      group: "when",
      description: 'e.g. "Free" or "₹499".',
      initialValue: "Free",
    }),

    /* ── Registration ── */
    defineField({
      name: "googleFormUrl",
      title: "Google Form link",
      type: "url",
      group: "registration",
      description:
        "Open the form in Google Forms → Send → link icon → copy. The website shows the same questions in its own design, and every registration lands in this form's Responses. In the form's Settings, turn off \"Restrict to users in your organisation\", \"Limit to 1 response\", verified email collection and file-upload questions, as they make visitors sign in to Google.",
      validation: (r) => [
        r.required().custom((url) =>
          !url || hasHost(url, GOOGLE_FORM_HOSTS)
            ? true
            : "Paste the Google Form's share link (docs.google.com/forms/… or forms.gle/…).",
        ),
        r.custom(checkFormWorksOnSite).warning(),
      ],
    }),
    defineField({
      name: "registrationOpen",
      title: "Accepting registrations",
      type: "boolean",
      group: "registration",
      description: "Turn off to close registrations early, e.g. when seats are full.",
      initialValue: true,
    }),
    defineField({
      name: "registrationDeadline",
      title: "Registrations close at",
      type: "datetime",
      group: "registration",
      description: "Optional. Leave empty to keep registrations open until the event ends.",
    }),
    defineField({
      name: "seatsNote",
      title: "Seats note",
      type: "string",
      group: "registration",
      description: 'Optional, e.g. "Limited to 60 seats".',
    }),

    /* ── WhatsApp community ── */
    defineField({
      name: "whatsappLink",
      title: "WhatsApp community or group invite link",
      type: "url",
      group: "community",
      description: "Shown to people right after they register.",
      validation: (r) =>
        r.custom((url) =>
          !url || hasHost(url, WHATSAPP_HOSTS)
            ? true
            : "Paste a WhatsApp invite link (chat.whatsapp.com/…, whatsapp.com/channel/… or wa.me/…).",
        ),
    }),
    defineField({
      name: "communityName",
      title: "Community name",
      type: "string",
      group: "community",
    }),
    defineField({
      name: "communityPhoto",
      title: "Community photo",
      type: "image",
      group: "community",
      options: { hotspot: true },
    }),
    defineField({
      name: "communityDescription",
      title: "Why join",
      type: "text",
      rows: 3,
      group: "community",
      description: 'e.g. "Get the joining link, reminders and the session recording here."',
    }),
  ],
  orderings: [
    { title: "Event date, newest first", name: "startsAtDesc", by: [{ field: "startsAt", direction: "desc" }] },
    { title: "Event date, oldest first", name: "startsAtAsc", by: [{ field: "startsAt", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", startsAt: "startsAt", media: "poster" },
    prepare({ title, startsAt, media }) {
      const subtitle = startsAt
        ? new Date(startsAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
          })
        : "No date yet";
      return { title, subtitle, media };
    },
  },
});
