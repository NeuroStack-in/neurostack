// Shows a Google Form's questions in the site's own design and sends the
// answers back to that same form, so registrations land in its Responses tab
// and linked Sheet. Google has no official API for submitting responses, so
// this reads the form's public page and posts to the endpoint the form itself
// uses. If Google changes either, the event page falls back to a plain link
// to the form.

const FORM_HOSTS = new Set(["docs.google.com", "forms.gle"]);
const FORM_REVALIDATE_SECONDS = 60;
const MAX_ANSWER_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The value Google uses for a ticked "Other" option.
export const OTHER_OPTION = "__other_option__";

export type QuestionKind = "short" | "paragraph" | "choice" | "dropdown" | "checkboxes" | "scale" | "date" | "time";

// Google's numeric item types → the questions we can show. Anything missing
// (grids, file uploads, ...) makes the form fall back to the Google link.
const KIND_BY_TYPE: Record<number, QuestionKind> = {
  0: "short",
  1: "paragraph",
  2: "choice",
  3: "dropdown",
  4: "checkboxes",
  5: "scale",
  9: "date",
  10: "time",
};
const TEXT_ITEM = 6;
const SECTION_BREAK = 8;
const IMAGE_ITEM = 11;
const VIDEO_ITEM = 12;

export interface FormQuestion {
  type: "question";
  key: string; // "entry.123456", the field name Google expects
  kind: QuestionKind;
  title: string;
  help?: string;
  required: boolean;
  options: string[];
  allowOther: boolean;
  scaleLabels?: [string, string];
}

export interface FormHeading {
  type: "heading";
  key: string;
  title: string;
  help?: string;
}

export type FormItem = FormQuestion | FormHeading;

// What the browser needs to draw the form.
export interface PublicForm {
  items: FormItem[];
  collectsEmail: boolean;
}

export interface ParsedForm extends PublicForm {
  status: "ok";
  submitUrl: string;
  pageCount: number;
  fbzx?: string;
}

export type GoogleFormResult =
  | ParsedForm
  | { status: "closed" }
  | { status: "unsupported"; reason: string }
  | { status: "unavailable" };

export type Answers = Record<string, string | string[] | undefined>;

/* ── Reading the form ── */

export function normalizeFormUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !FORM_HOSTS.has(url.hostname)) return null;
  if (url.hostname === "forms.gle") return url.toString();
  // docs.google.com/forms/d/e/<published id>/viewform, or /forms/d/<id>/edit
  const match = url.pathname.match(/^\/forms(?:\/u\/\d+)?\/d\/(e\/)?([\w-]+)/);
  if (!match) return null;
  return `https://docs.google.com/forms/d/${match[1] ?? ""}${match[2]}/viewform`;
}

export async function loadGoogleForm(rawUrl: string): Promise<GoogleFormResult> {
  const url = normalizeFormUrl(rawUrl);
  if (!url) return { status: "unsupported", reason: "not-a-google-form-link" };

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "Accept-Language": "en" },
      next: { revalidate: FORM_REVALIDATE_SECONDS },
    });
  } catch {
    return { status: "unavailable" };
  }
  if (res.url.includes("/closedform")) return { status: "closed" };
  if (res.url && !res.url.startsWith("https://docs.google.com/")) {
    // Redirected to a Google sign-in page
    return { status: "unsupported", reason: "sign-in-required" };
  }
  if (!res.ok) return { status: "unavailable" };
  return parseGoogleForm(await res.text());
}

// Safe walk into Google's nested arrays.
function at(value: unknown, ...path: number[]): unknown {
  return path.reduce<unknown>((node, i) => (Array.isArray(node) ? node[i] : undefined), value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseGoogleForm(html: string): GoogleFormResult {
  const match = html.match(/FB_PUBLIC_LOAD_DATA_ = (\[[\s\S]*?\]);<\/script>/);
  if (!match) {
    if (html.includes("closedform") || html.includes("no longer accepting responses")) return { status: "closed" };
    return { status: "unsupported", reason: "sign-in-required" };
  }

  let data: unknown;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return { status: "unavailable" };
  }

  const items: FormItem[] = [];
  let pageCount = 1;
  const rawItems = at(data, 1, 1);

  for (const raw of Array.isArray(rawItems) ? rawItems : []) {
    const itemId = String(at(raw, 0));
    const title = text(at(raw, 1));
    const help = text(at(raw, 2)) || undefined;
    const typeId = at(raw, 3);

    if (typeId === SECTION_BREAK || typeId === TEXT_ITEM) {
      if (typeId === SECTION_BREAK) pageCount += 1;
      if (title || help) items.push({ type: "heading", key: `heading-${itemId}`, title, help });
      continue;
    }
    if (typeId === IMAGE_ITEM || typeId === VIDEO_ITEM) continue;

    const kind = typeof typeId === "number" ? KIND_BY_TYPE[typeId] : undefined;
    if (!kind) return { status: "unsupported", reason: `question-type-${String(typeId)}` };

    const field = at(raw, 4, 0);
    const entryId = at(field, 0);
    if (typeof entryId !== "number") return { status: "unsupported", reason: "missing-entry-id" };

    const rawOptions = at(field, 1);
    const optionList = Array.isArray(rawOptions) ? rawOptions : [];
    items.push({
      type: "question",
      key: `entry.${entryId}`,
      kind,
      title,
      help,
      required: at(field, 2) === 1,
      options: optionList.map((o) => text(at(o, 0))).filter(Boolean),
      allowOther: optionList.some((o) => at(o, 4) === 1),
      scaleLabels: kind === "scale" ? [text(at(field, 3, 0)), text(at(field, 3, 1))] : undefined,
    });
  }

  // "e/<published id>": where the form posts its answers
  const formPath = at(data, 14);
  const actionMatch = html.match(/action="(https:\/\/docs\.google\.com\/forms\/[^"]+\/formResponse)"/);
  const submitUrl =
    typeof formPath === "string" && formPath.startsWith("e/")
      ? `https://docs.google.com/forms/d/${formPath}/formResponse`
      : actionMatch?.[1];
  if (!submitUrl) return { status: "unsupported", reason: "missing-submit-url" };

  // Email collected as a typed answer ("Responder input"). Verified email
  // needs a Google sign-in and never reaches this point.
  const emailSetting = at(data, 1, 10, 6);
  const collectsEmail =
    (typeof emailSetting === "number" && emailSetting > 1) || html.includes('name="emailAddress"');

  return {
    status: "ok",
    items,
    collectsEmail,
    submitUrl,
    pageCount,
    fbzx: html.match(/name="fbzx" value="(-?\d+)"/)?.[1],
  };
}

export function toPublicForm(form: ParsedForm): PublicForm {
  return { items: form.items, collectsEmail: form.collectsEmail };
}

/* ── Submitting ── */

function values(answer: Answers[string]): string[] {
  const list = Array.isArray(answer) ? answer : answer ? [answer] : [];
  return list.map((v) => String(v).trim()).filter(Boolean);
}

export function buildSubmission(
  form: ParsedForm,
  answers: Answers,
): { body: URLSearchParams } | { fieldErrors: Record<string, string> } {
  const body = new URLSearchParams();
  const fieldErrors: Record<string, string> = {};

  if (form.collectsEmail) {
    const email = values(answers.emailAddress)[0] ?? "";
    if (!EMAIL_PATTERN.test(email) || email.length > 254) fieldErrors.emailAddress = "Enter a valid email address.";
    else body.append("emailAddress", email);
  }

  for (const q of form.items) {
    if (q.type !== "question") continue;
    const given = values(answers[q.key]);
    const otherText = values(answers[`${q.key}.other_option_response`])[0] ?? "";

    if (given.length === 0) {
      if (q.required) fieldErrors[q.key] = "This question is required.";
      continue;
    }
    if (given.some((v) => v.length > MAX_ANSWER_LENGTH) || otherText.length > MAX_ANSWER_LENGTH) {
      fieldErrors[q.key] = "This answer is too long.";
      continue;
    }

    switch (q.kind) {
      case "choice":
      case "dropdown":
      case "scale":
      case "checkboxes": {
        const chosen = q.kind === "checkboxes" ? given : given.slice(0, 1);
        for (const choice of chosen) {
          if (choice === OTHER_OPTION && q.allowOther) {
            if (!otherText) {
              fieldErrors[q.key] = 'Fill in your "Other" answer.';
              break;
            }
            body.append(q.key, OTHER_OPTION);
            body.append(`${q.key}.other_option_response`, otherText);
          } else if (q.options.includes(choice)) {
            body.append(q.key, choice);
          } else {
            fieldErrors[q.key] = "Choose one of the listed options.";
            break;
          }
        }
        break;
      }
      case "date": {
        const m = given[0].match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) {
          fieldErrors[q.key] = "Enter a valid date.";
          break;
        }
        body.append(`${q.key}_year`, m[1]);
        body.append(`${q.key}_month`, String(Number(m[2])));
        body.append(`${q.key}_day`, String(Number(m[3])));
        break;
      }
      case "time": {
        const m = given[0].match(/^(\d{2}):(\d{2})$/);
        if (!m) {
          fieldErrors[q.key] = "Enter a valid time.";
          break;
        }
        body.append(`${q.key}_hour`, m[1]);
        body.append(`${q.key}_minute`, m[2]);
        break;
      }
      default:
        body.append(q.key, given[0]);
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  body.append("fvv", "1");
  body.append("pageHistory", Array.from({ length: form.pageCount }, (_, i) => i).join(","));
  if (form.fbzx) {
    body.append("fbzx", form.fbzx);
    body.append("partialResponse", JSON.stringify([null, null, form.fbzx]));
  }
  return { body };
}

export async function submitGoogleForm(form: ParsedForm, body: URLSearchParams): Promise<boolean> {
  try {
    const res = await fetch(form.submitUrl, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
