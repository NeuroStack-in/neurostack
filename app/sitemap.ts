import type { MetadataRoute } from "next";
import { getEventSlugs } from "@/sanity/lib/events";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://neurostack.in";
  const events = await getEventSlugs();

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  ];
}
