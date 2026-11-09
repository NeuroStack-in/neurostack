import { NextResponse } from "next/server";
import { loadGoogleForm } from "@/lib/googleForm";

// Used by the event editor in /studio to warn, while an event is being set
// up, when its Google Form can't be filled in on the website.
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return NextResponse.json({ problem: "missing-url" }, { status: 400 });

  const form = await loadGoogleForm(url, { checkAccess: true });
  const problem =
    form.status === "ok" ? null : form.status === "unsupported" ? form.reason : form.status;
  return NextResponse.json({ problem }, { headers: { "Cache-Control": "no-store" } });
}
