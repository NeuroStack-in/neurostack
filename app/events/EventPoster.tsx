import Image from "next/image";
import { imageUrl, type SanityImage } from "@/sanity/lib/events";

interface EventPosterProps {
  poster?: SanityImage;
  title: string;
  width: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}

// Shows the whole poster (never cropped) over a blurred copy of itself,
// so posters of any shape fill the frame neatly.
export default function EventPoster({ poster, title, width, sizes, priority, className = "" }: EventPosterProps) {
  if (!poster?.asset) {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center ${className}`} style={{ background: "linear-gradient(160deg, #0A2647 0%, #0D3A6B 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <Image src="/logo.png" alt="" width={72} height={72} className="relative opacity-40" />
      </div>
    );
  }

  const blur = poster.asset.metadata?.lqip;
  return (
    <div className={`relative overflow-hidden bg-[#0A2647] ${className}`}>
      {blur && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-70"
          style={{ backgroundImage: `url(${blur})` }}
        />
      )}
      <Image
        src={imageUrl(poster, width)}
        alt={poster.alt || `${title} poster`}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="object-contain"
      />
    </div>
  );
}
