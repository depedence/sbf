export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-base-950">
      <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-accent/25 blur-[120px] animate-float" />
      <div className="absolute -bottom-48 -right-24 h-[36rem] w-[36rem] rounded-full bg-cyan-glow/15 blur-[130px] animate-floatSlow" />
      <div className="absolute top-1/3 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-income/10 blur-[110px] animate-float" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
