export default function ImmersiveTransition2() {
  return (
    <section
      id="jejak-intro"
      className="relative overflow-hidden"
      style={{ minHeight: "clamp(400px, 50vw, 696px)" }}
    >
      {/* ── Bauhaus: Orange corner block ───────────────────────────────────
          Figma #2003:371: x=0, y=96, w=256, h=256
          fills=#F39A2E, opacity=0.8
          borderRadius="0px 0px 256px 0px"  ← bottom-RIGHT corner rounded
          → left-0, top-24 (96px from section top)
      ─────────────────────────────────────────────────────────────────── */}
      {/* <div
        className="absolute left-0 top-24 w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] lg:w-[256px] lg:h-[256px] bg-accent-orange pointer-events-none opacity-80"
        style={{ borderRadius: "0 0 256px 0", zIndex: 10 }}
        aria-hidden="true"
      /> */}

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/immersive-2.png')" }}
        />
        {/* Dark green overlay + blur — Figma: rgba(0,67,47,0.3), blur 1px */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0, 67, 47, 0.3)",
            backdropFilter: "blur(1px)",
          }}
        />
      </div>

      {/* Content — "SETIAP LANGKAH MENJADI CERITA." */}
      <div className="relative z-20 h-full min-h-[400px] lg:min-h-[696px] flex items-center justify-center px-6 sm:px-16">
        <h2
          className="text-white font-extrabold uppercase text-center"
          style={{
            fontSize: "clamp(36px, 5.6vw, 72px)",
            letterSpacing: "-0.04em",
            lineHeight: "1",
          }}
        >
          SETIAP LANGKAH
          <br />
          MENJADI CERITA.
        </h2>
      </div>
    </section>
  );
}
