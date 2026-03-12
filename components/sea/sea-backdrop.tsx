export function SeaBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(18,18,20,0.78)_28%,rgba(8,8,10,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.06),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(176,184,193,0.08),transparent_32%)]" />
      <div className="absolute left-1/2 top-0 h-[24rem] w-[min(72rem,96vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,220,228,0.12)_0%,rgba(214,220,228,0.03)_46%,transparent_76%)] blur-3xl" />
      <div className="absolute left-[12%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[120px]" />
      <div className="absolute right-[10%] top-[24%] h-[22rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(176,184,193,0.07)_0%,transparent_70%)] blur-[120px]" />
      <div className="absolute inset-x-[10%] bottom-[-10rem] h-[20rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,219,227,0.1)_0%,rgba(213,219,227,0.03)_42%,transparent_70%)] blur-[100px]" />
    </div>
  )
}
