import { BOOKING_URL, VIDEO_SRC, heroEmails, video } from "@/content";
import { EmailCard } from "./EmailCard";
import { Arrow } from "./Arrow";

function embedUrl(src: string) {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function Video() {
  const embed = VIDEO_SRC ? embedUrl(VIDEO_SRC) : null;
  return (
    <section id="film" className="frame bg-tint pb-[clamp(72px,8vw,128px)]" aria-labelledby="film-title">
      <div data-reveal className="grid12 items-end gap-y-6 pb-10">
        <h2 id="film-title" className="col-span-12 text-[length:var(--text-head)] md:col-span-6">{video.title}</h2>
        <p className="col-span-12 max-w-[42ch] text-[length:var(--text-body)] md:col-span-5 md:col-start-8">{video.line}</p>
      </div>
      <div className={`relative w-full overflow-hidden rounded-[24px] bg-tint ${VIDEO_SRC ? "aspect-video" : "aspect-[4/5] sm:aspect-video"}`}>
        {embed ? (
          <iframe className="absolute inset-0 h-full w-full" src={embed} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
        ) : VIDEO_SRC ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={VIDEO_SRC} controls playsInline preload="metadata" />
        ) : (
          // Until the film is added, the slot shows the product's own output, not a grey box.
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6 md:gap-8">
            <div className="flex h-[78%] w-full items-stretch justify-center gap-[2%] md:h-[74%]">
              {heroEmails.map((e, i) => (
                <div key={e.months} className={`aspect-[4/5] h-full ${i === 1 ? "" : "hidden md:block"}`}>
                  <EmailCard email={e} />
                </div>
              ))}
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn">
              {video.fallbackAction} <Arrow />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
