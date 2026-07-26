export default function ImmersiveTransition1() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "500px", height: "clamp(500px, 50vw, 700px)" }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/immersive-1.jpg')",
          backgroundPosition: "center 30%",
         }}
        aria-hidden="true"
      />

      {/* Orange tint overlay — Figma: rgba(243,154,46,0.1), borderRadius "0 0 0 940px" */}
      <div
        className="absolute inset-0 bg-accent-orange/10 pointer-events-none"
        style={{ borderRadius: "0 0 0 940px" }}
        aria-hidden="true"
      />

      {/* Green overlay — Figma: rgba(31,91,69,0.4) */}
      <div
        className="absolute inset-0 bg-primary/40 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8 px-6 sm:px-16 text-center">
        <blockquote>
          <p className="text-white text-sm sm:text-base leading-[1.25] italic max-w-xl sm:max-w-2xl">
            &ldquo;Disiplin bukan sekadar baris-berbaris, tetapi karakter yang
            dibangun setiap hari.&rdquo;
          </p>
        </blockquote>
        {/* Red accent bar — Figma: 96×4, fills primary green */}
        <div className="w-24 h-1 bg-primary" aria-hidden="true" />
      </div>
    </section>
  );
}
