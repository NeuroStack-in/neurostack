import type { Metadata } from "next";
import Link from "next/link";
import AnimateOnScroll from "../components/AnimateOnScroll";
import { EventCard, FeaturedEventCard, PastEventCard } from "./EventCard";
import { ArrowIcon } from "./icons";
import { getEvents, isUpcoming } from "@/sanity/lib/events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Workshops, webinars and meetups on applied AI, hosted by NeuroStack. See what's coming up and register in under a minute.",
  alternates: { canonical: "https://neurostack.in/events" },
};

export default async function EventsPage() {
  const events = await getEvents();
  const now = new Date();
  const upcoming = events.filter((e) => isUpcoming(e, now));
  const past = events.filter((e) => !isUpcoming(e, now)).reverse();
  const featured = upcoming.find((e) => e.featured) ?? (upcoming.length > 0 ? upcoming[0] : undefined);
  const rest = upcoming.filter((e) => e !== featured);

  return (
    <main>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-36 pb-20" style={{ background: "linear-gradient(135deg, #FFF5EE 0%, #FAFCFF 50%, #EEF4FF 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" style={{ backgroundColor: "#FF6B00" }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none" style={{ backgroundColor: "#4A90D9" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-[0.15em] uppercase">Events</span>
            </div>
            <h1 className="hero-anim-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] mb-6">
              Learn, build and connect<br /><span className="text-accent">with NeuroStack.</span>
            </h1>
            <p className="hero-anim-2 text-gray-500 text-lg sm:text-xl leading-relaxed max-w-xl">
              Hands-on workshops, webinars and meetups on applied AI. Pick an event and register in under a minute.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ UPCOMING ═══════════ */}
      <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(10,38,71,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[2px] bg-accent rounded-full" />
                <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">Coming Up</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-[1.1]">Upcoming Events</h2>
            </div>
          </AnimateOnScroll>

          {featured ? (
            <>
              <AnimateOnScroll animation="fade-up">
                <FeaturedEventCard event={featured} />
              </AnimateOnScroll>
              {rest.length > 0 && (
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {rest.map((event, i) => (
                    <AnimateOnScroll key={event._id} animation="fade-up" delay={(i % 3) * 100} className="h-full">
                      <EventCard event={event} />
                    </AnimateOnScroll>
                  ))}
                </div>
              )}
            </>
          ) : (
            <AnimateOnScroll animation="fade-up">
              <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0A2647 0%, #0D3A6B 100%)" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="relative max-w-xl mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">New events are on the way</h3>
                  <p className="text-white/65 leading-relaxed mb-8">
                    There&apos;s nothing scheduled right now. Follow us on LinkedIn to hear about the next workshop first.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href="https://www.linkedin.com/company/neurostack-org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-accent text-white font-semibold rounded-full px-7 py-3.5 text-sm hover:bg-[#e05f00] hover:shadow-[0_8px_30px_rgba(255,107,0,0.35)] transition-all duration-300"
                    >
                      Follow on LinkedIn
                      <ArrowIcon className="w-4 h-4" />
                    </a>
                    <Link href="/contact" className="inline-flex items-center gap-2 text-white/80 font-semibold rounded-full px-7 py-3.5 text-sm border border-white/15 hover:border-white/40 hover:text-white transition-all duration-300">
                      Host an event with us
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* ═══════════ PAST ═══════════ */}
      {past.length > 0 && (
        <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f8faff 0%, #ffffff 50%, #fff8f3 100%)" }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-[2px] bg-accent rounded-full" />
                  <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">Archive</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-primary leading-[1.1]">Past Events</h2>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {past.map((event, i) => (
                <AnimateOnScroll key={event._id} animation="fade-up" delay={(i % 4) * 80}>
                  <PastEventCard event={event} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
