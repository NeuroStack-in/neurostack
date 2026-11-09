// Sanity project settings. These values are public (they appear in every
// image URL), so they are safe to keep in the repo. Set the project ID once
// the Sanity project exists; until then the events pages show an empty state.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-10-01";

export const isSanityConfigured = projectId !== "";
