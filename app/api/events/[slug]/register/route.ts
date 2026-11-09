import { NextResponse } from "next/server";
import { buildSubmission, loadGoogleForm, normalizeFormUrl, submitGoogleForm, type Answers } from "@/lib/googleForm";
import { communityInvite, getEventRegistration, isRegistrationOpen } from "@/sanity/lib/events";

const MAX_BODY_BYTES = 50_000;

// Receives a registration from the event page, sends it into the event's
// Google Form, and replies with the WhatsApp community details.
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "That's more than we can accept in one go." }, { status: 413 });
  }
  let payload: { answers?: unknown; website?: unknown };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const event = await getEventRegistration(slug);
  if (!event) return NextResponse.json({ error: "We couldn't find this event." }, { status: 404 });

  // Only bots fill in the hidden "website" field: act as if it worked but send nothing.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ ok: true, community: null });
  }

  const closed = NextResponse.json({ error: "Registrations for this event are closed." }, { status: 409 });
  if (!isRegistrationOpen(event) || !event.googleFormUrl) return closed;

  const fallbackUrl = normalizeFormUrl(event.googleFormUrl) ?? undefined;
  const form = await loadGoogleForm(event.googleFormUrl);
  if (form.status === "closed") return closed;
  if (form.status !== "ok") {
    return NextResponse.json({ error: "Registration isn't working here right now.", fallbackUrl }, { status: 503 });
  }

  const submission = buildSubmission(form, cleanAnswers(payload.answers));
  if ("fieldErrors" in submission) {
    return NextResponse.json(
      { error: "Please check the highlighted answers.", fieldErrors: submission.fieldErrors },
      { status: 422 },
    );
  }
  if (!(await submitGoogleForm(form, submission.body))) {
    return NextResponse.json({ error: "We couldn't save your registration.", fallbackUrl }, { status: 502 });
  }

  return NextResponse.json({ ok: true, community: communityInvite(event) });
}

// Keep only string answers (or lists of strings) from the request.
function cleanAnswers(raw: unknown): Answers {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const answers: Answers = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") answers[key] = value;
    else if (Array.isArray(value)) answers[key] = value.filter((v): v is string => typeof v === "string");
  }
  return answers;
}
