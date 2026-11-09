// The team's editor for events: neurostack.in/studio
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 text-center">
        <p className="max-w-md text-gray-600">
          The events editor isn&apos;t connected yet. Add the Sanity project ID in <code>sanity/env.ts</code> or as{" "}
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
