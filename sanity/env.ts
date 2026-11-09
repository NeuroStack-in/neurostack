// Sanity project settings (sanity.io/manage → "NeuroStack Website"). These
// values are public (they appear in every image URL), so they are safe to
// keep in the repo. An empty project ID shows the events pages' empty state.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "s4xc2k1m";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-10-01";

export const isSanityConfigured = projectId !== "";
